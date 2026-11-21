
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function createAdminRouter(db) {
    const router = express.Router();

    // Verify admin token
    function verifyAdmin(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Admin token required"
            });
        }

        const token = authHeader.split(" ")[1];

        try {
            req.admin = jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
    }

    // Admin Login API
    router.post("/login", async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Username and password are required"
                });
            }

            const result = await db.query(
                `SELECT id, username, password_hash
                 FROM admins
                 WHERE username = $1`,
                [username]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid username or password"
                });
            }

            const admin = result.rows[0];

            const isPasswordValid = await bcrypt.compare(
                password,
                admin.password_hash
            );

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid username or password"
                });
            }

            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not configured");
            }

            const token = jwt.sign(
                {
                    id: admin.id,
                    username: admin.username
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                success: true,
                message: "Admin login successful",
                token,
                admin: {
                    id: admin.id,
                    username: admin.username
                }
            });

        } catch (error) {
            console.error("Admin Login Error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    });

    // Get all registered participants
    router.get("/participants", verifyAdmin, async (req, res) => {
        try {
            const result = await db.query(
                `SELECT
                    id,
                    full_name,
                    email,
                    alternate_email,
                    mobile,
                    institution,
                    country,
                    participant_category,
                    presentation_type
                 FROM participants
                 ORDER BY id DESC`
            );

            return res.status(200).json({
                success: true,
                total: result.rows.length,
                participants: result.rows
            });

        } catch (error) {
            console.error("Fetch Participants Error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to fetch participants"
            });
        }
    });

    return router;
}

module.exports = createAdminRouter;