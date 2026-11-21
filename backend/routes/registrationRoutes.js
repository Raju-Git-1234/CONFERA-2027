
require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");

function createRegistrationRouter(db) {

    console.log("CONFERA REGISTRATION ROUTE LOADED");

    const router = express.Router();

    // Gmail configuration
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Participant Registration API
    router.post("/", async (req, res) => {

        console.log("Registration API called");

        try {

            const {
                fullName,
                email,
                alternateEmail,
                mobile,
                institution,
                country,
                participantCategory,
                presentationType
            } = req.body;

            // Validate required fields
            if (
                !fullName ||
                !email ||
                !mobile ||
                !institution ||
                !country ||
                !participantCategory ||
                !presentationType
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please fill all required fields"
                });
            }

            // Save participant in PostgreSQL
            const result = await db.query(
                `INSERT INTO participants
                (
                    full_name,
                    email,
                    alternate_email,
                    mobile,
                    institution,
                    country,
                    participant_category,
                    presentation_type
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *`,
                [
                    fullName.trim(),
                    email.trim(),
                    alternateEmail ? alternateEmail.trim() : null,
                    mobile.trim(),
                    institution.trim(),
                    country.trim(),
                    participantCategory,
                    presentationType
                ]
            );

            const participant = result.rows[0];

            console.log("PostgreSQL registration successful!");
            console.log("Sending notification to:", process.env.ADMIN_EMAIL);

            // Send organizer notification
            try {

                const mailInfo = await transporter.sendMail({

                    from: process.env.EMAIL_USER,

                    to: process.env.ADMIN_EMAIL,

                    subject: "CONFERA - New Participant Registration",

                    text: `
NEW PARTICIPANT REGISTERED IN CONFERA 2027

Registration ID: ${participant.id}

Name: ${participant.full_name}

Email: ${participant.email}

Alternate Email: ${participant.alternate_email || "Not provided"}

Mobile: ${participant.mobile}

Institution: ${participant.institution}

Country: ${participant.country}

Participant Category: ${participant.participant_category}

Presentation Type: ${participant.presentation_type}
                    `
                });

                console.log("EMAIL SENT SUCCESSFULLY!");
                console.log("Email Message ID:", mailInfo.messageId);

            } catch (emailError) {

                console.error("EMAIL SENDING FAILED!");
                console.error(emailError);
            }

            return res.status(201).json({

                success: true,

                message: "Registration submitted successfully",

                participant

            });

        } catch (error) {

            console.error("REGISTRATION ERROR:", error);

            return res.status(500).json({

                success: false,

                message: "Registration failed. Please try again."

            });
        }
    });

    return router;
}

module.exports = createRegistrationRouter;  