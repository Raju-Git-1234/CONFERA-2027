
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

require("dotenv").config();

// ROUTE IMPORTS
const createAdminRouter = require("./routes/adminRoutes");
const createRegistrationRouter = require("./routes/registrationRoutes");
const createPaperRouter = require("./routes/paperRoutes");
const createVisitorRouter = require("./routes/visitorRoutes");
const createMessageRouter = require("./routes/messageRoutes");
const createConferenceRouter = require("./routes/conferenceRoutes");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// REQUEST LOGGER
app.use((req, res, next) => {
    console.log("API REQUEST:", req.method, req.originalUrl);
    next();
});

// POSTGRESQL CONNECTION
const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});

db.on("error", (error) => {
    console.error("PostgreSQL Pool Error:", error.message);
});

// ADMIN ROUTES
app.use("/api/admin", createAdminRouter(db));
console.log("ADMIN ROUTES LOADED");

// REGISTRATION ROUTES
app.use("/api/registration", createRegistrationRouter(db));
console.log("REGISTRATION ROUTES LOADED");

// PAPER SUBMISSION ROUTES
app.use("/api/papers", createPaperRouter(db));
console.log("PAPER ROUTES MOUNTED");

// VISITOR ANALYTICS ROUTES
app.use("/api/visitors", createVisitorRouter(db));
console.log("VISITOR ROUTES MOUNTED");

// CONTACT MESSAGE ROUTES
app.use("/api/messages", createMessageRouter(db));
console.log("MESSAGE ROUTES MOUNTED");

// CONFERENCE MANAGEMENT ROUTES
app.use("/api/conference", createConferenceRouter(db));
console.log("CONFERENCE MANAGEMENT ROUTES MOUNTED");

// UPLOADED FILES
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// HOME
app.get("/", (req, res) => {
    res.send("Welcome to CONFERA 2027 Backend API!");
});

// GENERAL TEST
app.get("/test", (req, res) => {
    res.send("CONFERA TEST ROUTE WORKING!");
});

// DATABASE TEST
app.get("/api/db-test", async (req, res) => {
    try {
        const result = await db.query("SELECT NOW()");

        res.status(200).json({
            success: true,
            message: "PostgreSQL connected successfully!",
            time: result.rows[0].now
        });

    } catch (error) {
        console.error("Database Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});

// ADMIN TEST
app.get("/api/admin/test", (req, res) => {
    res.json({
        success: true,
        message: "CONFERA ADMIN ROUTES WORKING!"
    });
});

// PAPER TEST
app.get("/api/papers/test", (req, res) => {
    res.json({
        success: true,
        message: "CONFERA PAPER ROUTES WORKING!"
    });
});

// VISITOR TEST
app.get("/api/visitors/test", (req, res) => {
    res.json({
        success: true,
        message: "CONFERA VISITOR ROUTES WORKING!"
    });
});

// MESSAGE TEST
app.get("/api/messages/test", (req, res) => {
    res.json({
        success: true,
        message: "CONFERA MESSAGE ROUTES WORKING!"
    });
});

// CONFERENCE TEST
app.get("/api/conference/test", (req, res) => {
    res.json({
        success: true,
        message: "CONFERA CONFERENCE MANAGEMENT API WORKING!"
    });
});

// 404 HANDLER
app.use((req, res) => {
    console.log("UNKNOWN ROUTE:", req.method, req.originalUrl);

    res.status(404).json({
        success: false,
        message: "API route not found",
        requestedUrl: req.originalUrl
    });
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("--------------------------------");
    console.log("CONFERA 2027 BACKEND STARTED");
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`General Test: http://localhost:${PORT}/test`);
    console.log(`Database: http://localhost:${PORT}/api/db-test`);
    console.log(`Admin Login: http://localhost:${PORT}/api/admin/login`);
    console.log(`Participants: http://localhost:${PORT}/api/admin/participants`);
    console.log(`Paper List: http://localhost:${PORT}/api/papers`);
    console.log(`Paper Upload: http://localhost:${PORT}/api/papers/submit`);
    console.log(`Visitor Test: http://localhost:${PORT}/api/visitors/test`);
    console.log(`Visitor Stats: http://localhost:${PORT}/api/visitors/stats`);
    console.log(`Messages: http://localhost:${PORT}/api/messages`);
    console.log(`Conference Test: http://localhost:${PORT}/api/conference/test`);
    console.log("--------------------------------");
});
