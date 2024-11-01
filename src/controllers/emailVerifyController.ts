import { Request, Response } from "express";
import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import pool from "../config/db";
import { generateTokens } from "../helper";

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // Change to your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Update refresh token in the database
    await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      user.id,
    ]);

    // Generate reset password link
    const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${accessToken}`;

    // Render the email template with ejs
    const templatePath = path.join(__dirname, "../templates/emailTemplate.ejs");
    const emailContent = await ejs.renderFile(templatePath, {
      username: user.username,
      resetPasswordLink,
    });

    // Send email with reset password link
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: emailContent,
    });

    res.json({ message: "Reset password link sent to your email" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { resetPassword };
