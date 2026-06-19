// src/lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"BSU Debate Society" <no-reply@debatesociety.bsu@gmail.com>',
      to,
      subject,
      html,
    });
    console.log(`✅ Email successfully sent to ${to}`);
  } catch (error) {
    // Log the error but don't throw it, so the main API request doesn't fail if the email service is down
    console.error("❌ Error sending email:", error);
  }
}