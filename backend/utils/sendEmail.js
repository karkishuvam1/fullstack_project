/**
 * Email Notification Utility for Lamborghini Clone
 * Supports Nodemailer SMTP with safe mock fallback for offline/development environments.
 */

async function sendEmail({ to, subject, html, text }) {
  try {
    let nodemailer;
    try {
      nodemailer = require("nodemailer");
    } catch (_) {
      nodemailer = null;
    }

    if (nodemailer && process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"Automobili Lamborghini" <${process.env.SMTP_FROM || "concierge@lamborghini.it"}>`,
        to,
        subject,
        text: text || html.replace(/<[^>]*>?/gm, ""),
        html,
      });

      console.log(`[EMAIL] Message sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } else {
      // In development or when SMTP is not configured, log email details
      console.log(`[EMAIL SIMULATED] To: ${to} | Subject: ${subject}`);
      return { success: true, simulated: true };
    }
  } catch (error) {
    console.warn(`[EMAIL ERROR] Failed to send email to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

module.exports = sendEmail;
