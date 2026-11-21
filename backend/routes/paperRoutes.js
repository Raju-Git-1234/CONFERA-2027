
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

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

  // Gmail configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
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

      // Send email notification to admin
      let emailSent = false;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
          subject: "New Research Paper Submission - CONFERA 2027",

          text: `
Dear Admin,

A new research paper has been submitted.

Participant Name: ${participantName}
Participant Email: ${email}
Paper File: ${req.file.originalname}

Please find the submitted research paper attached.

Regards,
CONFERA 2027
          `,

          html: `
            <h2>New Research Paper Submission</h2>
            <p>A participant has submitted a research paper.</p>
            <p><strong>Participant Name:</strong> ${participantName}</p>
            <p><strong>Participant Email:</strong> ${email}</p>
            <p><strong>Paper File:</strong> ${req.file.originalname}</p>
            <p>Please find the research paper attached.</p>
            <br/>
            <p>Regards,<br/>CONFERA 2027</p>
          `,

          attachments: [
            {
              filename: req.file.originalname,
              path: req.file.path
            }
          ]
        });

        emailSent = true;
        console.log("PAPER NOTIFICATION EMAIL SENT SUCCESSFULLY");

      } catch (mailError) {
        console.error("Paper notification email failed:", mailError.message);
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
