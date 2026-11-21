
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config();

const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});

async function createAdmin() {
    try {
        // Admin login details
        const username = "admin";
        const password = "ChangeMe_2027!";

        // Check whether admin already exists
        const existingAdmin = await db.query(
            "SELECT id FROM admins WHERE username = $1",
            [username]
        );

        if (existingAdmin.rows.length > 0) {
            console.log("Admin account already exists!");
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Save admin in PostgreSQL
        await db.query(
            "INSERT INTO admins (username, password_hash) VALUES ($1, $2)",
            [username, passwordHash]
        );

        console.log("--------------------------------");
        console.log("ADMIN ACCOUNT CREATED!");
        console.log("Username: admin");
        console.log("Password: ChangeMe_2027!");
        console.log("Please change this password before production.");
        console.log("--------------------------------");

    } catch (error) {
        console.error("Admin Creation Error:", error.message);

    } finally {
        await db.end();
    }
}

createAdmin();
