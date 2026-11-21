
const express = require("express");
const jwt = require("jsonwebtoken");

module.exports = (db) => {
    const router = express.Router();

    console.log("CONFERA MESSAGE ROUTES LOADED");

    // VERIFY ADMIN TOKEN
    function verifyAdmin(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Admin login required."
            });
        }

        try {
            const token = authHeader.split(" ")[1];

            req.admin = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            next();

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired admin token."
            });
        }
    }

    // PUBLIC: SAVE CONTACT MESSAGE
    router.post("/send", async (req, res) => {
        try {
            const { name, email, subject, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({
                    success: false,
                    message: "Name, email and message are required."
                });
            }

            const result = await db.query(
                `INSERT INTO contact_messages
                (name, email, subject, message)
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [name, email, subject || null, message]
            );

            return res.status(201).json({
                success: true,
                message: "Message submitted successfully.",
                data: result.rows[0]
            });

        } catch (error) {
            console.error("Message Save Error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to submit message."
            });
        }
    });

    // ADMIN ONLY: GET ALL CONTACT MESSAGES
    router.get("/", verifyAdmin, async (req, res) => {
        try {
            const result = await db.query(
                `SELECT * FROM contact_messages
                 ORDER BY created_at DESC`
            );

            return res.status(200).json({
                success: true,
                total: result.rows.length,
                messages: result.rows
            });

        } catch (error) {
            console.error("Message Fetch Error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to fetch messages."
            });
        }
    });

    // ADMIN ONLY: DELETE CONTACT MESSAGE
    router.delete("/:id", verifyAdmin, async (req, res) => {
        try {
            const messageId = Number(req.params.id);

            if (!Number.isInteger(messageId) || messageId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid message ID."
                });
            }

            const result = await db.query(
                `DELETE FROM contact_messages
                 WHERE id = $1
                 RETURNING id`,
                [messageId]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Message not found."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Contact message deleted successfully.",
                deletedId: result.rows[0].id
            });

        } catch (error) {
            console.error("Message Delete Error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to delete contact message."
            });
        }
    });

    return router;
};
