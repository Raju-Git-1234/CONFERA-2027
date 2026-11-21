require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendTestEmail() {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "CONFERA - Gmail Test",
      text: "Success! CONFERA Gmail notification is working.",
    });

    console.log("Test email sent successfully!");
  } catch (error) {
    console.error("Email error:", error.message);
  }
}

sendTestEmail();