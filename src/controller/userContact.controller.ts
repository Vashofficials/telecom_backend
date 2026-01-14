import { Request, Response } from "express";
import { transporter, sendTestEmail } from "../utils/sendMail";

const createUserContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate all fields
    if (!name || !email || !phone || !subject || !message) {
      res.status(400).json({ error: "All fields are required." });
    }

    // Send email via Nodemailer asynchronously
    console.log("Phone type:", typeof phone); // keep phone logging for debugging
    sendTestEmail(name, email, phone, subject, message)
      .catch(err => console.error("Background Contact Email Error:", err));

    // Respond success immediately
    res.status(201).json({
      success: true,
      message: "Message received successfully.",
    });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while sending the email.",
    });
  }
};

const testEmailConnection = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Check Credentials
    const envVars = {
      EMAIL_USER: process.env.EMAIL_USER ? "Set" : "Missing",
      EMAIL_PASS: process.env.EMAIL_PASS ? "Set" : "Missing",
      SMTP_MAIL_RECEIVER: process.env.SMTP_MAIL_RECEIVER ? "Set" : "Missing",
    };

    if (envVars.EMAIL_USER === "Missing" || envVars.EMAIL_PASS === "Missing") {
      res.status(500).json({ success: false, error: "Missing Credentials", envVars });
      return;
    }

    // 2. Verify SMTP Connection
    try {
      await transporter.verify();
      console.log("✅ SMTP Connection Verified");
    } catch (smtpError: any) {
      console.error("❌ SMTP Verification Failed:", smtpError);
      res.status(500).json({ success: false, error: "SMTP Connection Failed", details: smtpError.message, envVars });
      return;
    }

    // 3. Attempt Test Send
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.SMTP_MAIL_RECEIVER || process.env.EMAIL_USER,
      subject: "Test Email from Backend Debugger",
      text: "If you receive this, the backend email system is working correctly.",
    });

    res.status(200).json({ success: true, message: "SMTP Connected and Test Email Sent Successfully", envVars });

  } catch (error: any) {
    console.error("❌ Test Email Failed:", error);
    res.status(500).json({ success: false, error: "Email Test Failed", details: error.message });
  }
};

export { createUserContact, testEmailConnection };
