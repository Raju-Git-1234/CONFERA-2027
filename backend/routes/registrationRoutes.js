
require("dotenv").config();

const express = require("express");
const { Resend } = require("resend");

function createRegistrationRouter(db) {

    console.log("CONFERA REGISTRATION ROUTE LOADED");

    const router = express.Router();

    // Resend HTTPS Email API
    const resend = new Resend(process.env.RESEND_API_KEY);

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

            // Send organizer notification using Resend HTTPS API
            try {

                if (!process.env.RESEND_API_KEY) {
                    throw new Error("RESEND_API_KEY is missing");
                }

                if (!process.env.ADMIN_EMAIL) {
                    throw new Error("ADMIN_EMAIL is missing");
                }

                const { data, error } = await resend.emails.send({

                    from: process.env.RESEND_FROM_EMAIL ||
                        "CONFERA 2027 <onboarding@resend.dev>",

                    to: [process.env.ADMIN_EMAIL],

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

                if (error) {
                    throw new Error(error.message || "Resend email failed");
                }

                console.log("EMAIL SENT SUCCESSFULLY!");
                console.log("Resend Email ID:", data?.id);

            } catch (emailError) {

                console.error("EMAIL SENDING FAILED!");
                console.error(emailError.message || emailError);
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
