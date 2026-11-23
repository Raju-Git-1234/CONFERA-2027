
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Resend } = require("resend");

module.exports = (db) => {

  const router = express.Router();

  console.log("CONFERA PAPER ROUTES LOADED");

  const uploadDir = path.join(__dirname, "../uploads/papers");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // File storage
  const storage = multer.diskStorage({

    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

      const uniqueName =
        Date.now() + "-" + Math.round(Math.random() * 1e9);

      cb(
        null,
        uniqueName + path.extname(file.originalname).toLowerCase()
      );
    }

  });

  // File validation
  const upload = multer({

    storage,

    limits: {
      fileSize: 10 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

      const allowed = [".pdf", ".doc", ".docx"];

      const ext = path.extname(file.originalname).toLowerCase();

      if (allowed.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error("Only PDF, DOC and DOCX files are allowed."));
      }

    }

  });

  // Submit research paper
  router.post("/submit", upload.single("paperFile"), async (req, res) => {

    try {

      const { participantName, email } = req.body;

      if (!participantName || !email || !req.file) {

        return res.status(400).json({
          success: false,
          message: "Participant name, email and paper file are required."
        });

      }

      const filePath = `/uploads/papers/${req.file.filename}`;

      // Save paper details in PostgreSQL
      const result = await db.query(

        `INSERT INTO paper_submissions
         (participant_name, email, file_name, file_path)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,

        [
          participantName,
          email,
          req.file.originalname,
          filePath
        ]

      );

      console.log("PAPER SAVED SUCCESSFULLY IN POSTGRESQL");

      // Send email notification using Resend HTTPS API
      let emailSent = false;

      try {

        if (!process.env.RESEND_API_KEY) {
          throw new Error("RESEND_API_KEY is missing");
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const adminEmail =
          process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

        if (!adminEmail) {
          throw new Error("Admin email address is missing");
        }

        // Read uploaded file and convert to Base64
        const attachmentContent = fs
          .readFileSync(req.file.path)
          .toString("base64");

        const { data, error } = await resend.emails.send({

          from: process.env.RESEND_FROM_EMAIL ||
            "CONFERA 2027 <onboarding@resend.dev>",

          to: [adminEmail],

          subject: "New Research Paper Submission - CONFERA 2027",

          text: `
Dear Admin,

A new research paper has been submitted.

Participant Name: ${participantName}
Participant Email: ${email}
Paper File: ${req.file.originalname}

The submitted research paper is attached to this email.

Regards,
CONFERA 2027
          `,

          html: `
            <h2>New Research Paper Submission</h2>

            <p>A participant has submitted a research paper.</p>

            <p><strong>Participant Name:</strong> ${participantName}</p>

            <p><strong>Participant Email:</strong> ${email}</p>

            <p><strong>Paper File:</strong> ${req.file.originalname}</p>

            <p>The submitted research paper is attached to this email.</p>

            <br/>

            <p>Regards,<br/>CONFERA 2027</p>
          `,

          attachments: [
            {
              filename: req.file.originalname,
              content: attachmentContent
            }
          ]

        });

        if (error) {
          throw new Error(error.message || "Resend email failed");
        }

        emailSent = true;

        console.log("PAPER NOTIFICATION EMAIL SENT SUCCESSFULLY");
        console.log("Resend Email ID:", data?.id);

      } catch (mailError) {

        console.error(
          "Paper notification email failed:",
          mailError.message || mailError
        );

      }

      return res.status(201).json({

        success: true,

        message: "Paper uploaded successfully.",

        emailSent,

        submission: result.rows[0]

      });

    } catch (error) {

      console.error("Paper submission error:", error);

      return res.status(500).json({

        success: false,

        message: "Paper upload failed."

      });

    }

  });

  // Get all paper submissions
  router.get("/", async (req, res) => {

    try {

      const result = await db.query(
        "SELECT * FROM paper_submissions ORDER BY submitted_at DESC"
      );

      return res.status(200).json({

        success: true,

        total: result.rows.length,

        submissions: result.rows

      });

    } catch (error) {

      console.error("Paper list error:", error);

      return res.status(500).json({

        success: false,

        message: "Unable to load paper submissions."

      });

    }

  });

  return router;

};
