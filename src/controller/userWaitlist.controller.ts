import { Request, Response } from "express";
import { sendTestEmail } from "../utils/sendMail";

const createUserWaitlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({ success: false, error: "All fields are required." });
      return;
    }

    // Send email asynchronously (do not await) to prevent timeout
    sendTestEmail(
      name,
      email,
      phone,
      `Waitlist Signup - ${name}`,
      `Hello ${name},<br/><br/>Thank you for joining our waitlist! We will notify you when we launch.<br/><br/>Phone: ${phone}<br/>Email: ${email}`
    ).catch(err => console.error("Background Email Error:", err));

    res.status(201).json({
      success: true,
      message: "Waitlist information received successfully.",
    });
  } catch (error) {
    console.error("❌ Error in waitlist controller:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while processing waitlist information.",
    });
  }
};

export { createUserWaitlist };
