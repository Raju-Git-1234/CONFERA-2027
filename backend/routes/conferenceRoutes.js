
const express = require("express");
const jwt = require("jsonwebtoken");

function createConferenceRouter(db) {
    const router = express.Router();

    // ADMIN AUTHENTICATION
    function verifyAdmin(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Admin token required"
            });
        }

        try {
            const token = authHeader.split(" ")[1];
            req.admin = jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired admin token"
            });
        }
    }

    // CONFERENCE DETAILS
    router.get("/details", async (req, res) => {
        try {
            const result = await db.query(
                "SELECT * FROM conference_details WHERE id = 1"
            );

            res.json({
                success: true,
                details: result.rows[0] || null
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Unable to fetch conference details"
            });
        }
    });

    router.put("/details", verifyAdmin, async (req, res) => {
        try {
            const { title, theme, event_date, venue, description } = req.body;

            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: "Conference title is required"
                });
            }

            const result = await db.query(
                `INSERT INTO conference_details
                    (id, title, theme, event_date, venue, description)
                 VALUES (1, $1, $2, $3, $4, $5)
                 ON CONFLICT (id)
                 DO UPDATE SET
                    title = EXCLUDED.title,
                    theme = EXCLUDED.theme,
                    event_date = EXCLUDED.event_date,
                    venue = EXCLUDED.venue,
                    description = EXCLUDED.description,
                    updated_at = CURRENT_TIMESTAMP
                 RETURNING *`,
                [title, theme || null, event_date || null,
                 venue || null, description || null]
            );

            res.json({
                success: true,
                message: "Conference details saved successfully",
                details: result.rows[0]
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Unable to save conference details"
            });
        }
    });

    // REUSABLE CRUD ROUTES
    function registerCrudRoutes(config) {
        const {
            route,
            table,
            columns,
            required,
            orderBy
        } = config;

        // GET ALL RECORDS
        router.get(`/${route}`, async (req, res) => {
            try {
                const result = await db.query(
                    `SELECT * FROM ${table} ORDER BY ${orderBy}`
                );

                res.json({
                    success: true,
                    total: result.rows.length,
                    data: result.rows
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: `Unable to fetch ${route}`
                });
            }
        });

        // ADD RECORD
        router.post(`/${route}`, verifyAdmin, async (req, res) => {
            try {
                for (const field of required) {
                    if (
                        req.body[field] === undefined ||
                        req.body[field] === null ||
                        req.body[field] === ""
                    ) {
                        return res.status(400).json({
                            success: false,
                            message: `${field} is required`
                        });
                    }
                }

                const values = columns.map(
                    column => req.body[column] ?? null
                );

                const placeholders = columns.map(
                    (_, index) => `$${index + 1}`
                );

                const result = await db.query(
                    `INSERT INTO ${table} (${columns.join(", ")})
                     VALUES (${placeholders.join(", ")})
                     RETURNING *`,
                    values
                );

                res.status(201).json({
                    success: true,
                    message: "Record added successfully",
                    data: result.rows[0]
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: "Unable to add record"
                });
            }
        });

        // UPDATE RECORD
        router.put(`/${route}/:id`, verifyAdmin, async (req, res) => {
            try {
                for (const field of required) {
                    if (
                        req.body[field] === undefined ||
                        req.body[field] === null ||
                        req.body[field] === ""
                    ) {
                        return res.status(400).json({
                            success: false,
                            message: `${field} is required`
                        });
                    }
                }

                const values = columns.map(
                    column => req.body[column] ?? null
                );

                const setClause = columns.map(
                    (column, index) => `${column} = $${index + 1}`
                );

                values.push(req.params.id);

                const result = await db.query(
                    `UPDATE ${table}
                     SET ${setClause.join(", ")}
                     WHERE id = $${values.length}
                     RETURNING *`,
                    values
                );

                if (result.rows.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Record not found"
                    });
                }

                res.json({
                    success: true,
                    message: "Record updated successfully",
                    data: result.rows[0]
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: "Unable to update record"
                });
            }
        });

        // DELETE RECORD
        router.delete(`/${route}/:id`, verifyAdmin, async (req, res) => {
            try {
                const result = await db.query(
                    `DELETE FROM ${table}
                     WHERE id = $1
                     RETURNING id`,
                    [req.params.id]
                );

                if (result.rows.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Record not found"
                    });
                }

                res.json({
                    success: true,
                    message: "Record deleted successfully"
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: "Unable to delete record"
                });
            }
        });
    }

    // IMPORTANT DATES
    registerCrudRoutes({
        route: "dates",
        table: "conference_dates",
        columns: ["event_name", "event_date", "description"],
        required: ["event_name", "event_date"],
        orderBy: "event_date ASC, id ASC"
    });

    // SPEAKERS
    registerCrudRoutes({
        route: "speakers",
        table: "conference_speakers",
        columns: ["name", "designation", "institution", "bio", "photo_url"],
        required: ["name"],
        orderBy: "id DESC"
    });

    // CONFERENCE SCHEDULE
    registerCrudRoutes({
        route: "schedule",
        table: "conference_schedule",
        columns: [
            "session_title",
            "speaker_name",
            "session_date",
            "start_time",
            "end_time",
            "description"
        ],
        required: ["session_title"],
        orderBy: "session_date ASC, start_time ASC, id ASC"
    });

    // ANNOUNCEMENTS
    registerCrudRoutes({
        route: "announcements",
        table: "conference_announcements",
        columns: ["title", "content"],
        required: ["title", "content"],
        orderBy: "created_at DESC, id DESC"
    });

    // TEST ROUTE
    router.get("/test", (req, res) => {
        res.json({
            success: true,
            message: "CONFERA CONFERENCE MANAGEMENT API WORKING!"
        });
    });

    return router;
}

module.exports = createConferenceRouter;
