
const express = require("express");

module.exports = (db) => {
    const router = express.Router();

    console.log("CONFERA VISITOR ROUTES LOADED");

    // TRACK WEBSITE VISITOR
    router.post("/track", async (req, res) => {
        try {
            const { visitorId } = req.body;

            if (
                !visitorId ||
                typeof visitorId !== "string" ||
                visitorId.length > 100
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Valid visitor ID is required."
                });
            }

            // Save or update visitor activity
            await db.query(
                `INSERT INTO website_visitors
                    (visitor_id, first_seen, last_seen)
                 VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                 ON CONFLICT (visitor_id)
                 DO UPDATE SET last_seen = CURRENT_TIMESTAMP`,
                [visitorId]
            );

            // Record one unique visit per visitor per day
            await db.query(
                `INSERT INTO visitor_daily_visits
                    (visitor_id, visit_date)
                 VALUES ($1, CURRENT_DATE)
                 ON CONFLICT (visitor_id, visit_date)
                 DO NOTHING`,
                [visitorId]
            );

            return res.status(200).json({
                success: true,
                message: "Visitor tracked successfully."
            });

        } catch (error) {
            console.error("Visitor Tracking Error:", error);

            return res.status(500).json({
                success: false,
                message: "Visitor tracking failed."
            });
        }
    });

    // GET VISITOR STATISTICS
    router.get("/stats", async (req, res) => {
        try {
            const result = await db.query(`
                SELECT
                    (SELECT COUNT(*)
                     FROM website_visitors) AS total_visitors,

                    (SELECT COUNT(*)
                     FROM visitor_daily_visits
                     WHERE visit_date = CURRENT_DATE)
                     AS today_visitors,

                    (SELECT COUNT(*)
                     FROM website_visitors
                     WHERE last_seen >=
                     CURRENT_TIMESTAMP - INTERVAL '2 minutes')
                     AS online_visitors
            `);

            return res.status(200).json({
                success: true,
                totalVisitors: Number(result.rows[0].total_visitors),
                todayVisitors: Number(result.rows[0].today_visitors),
                onlineVisitors: Number(result.rows[0].online_visitors)
            });

        } catch (error) {
            console.error("Visitor Statistics Error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to load visitor statistics."
            });
        }
    });

    return router;
};
