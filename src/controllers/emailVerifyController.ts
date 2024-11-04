import { Request, Response, RequestHandler } from "express";
import dotenv from "dotenv";
import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateTokens } from "../helper";

dotenv.config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  logger: true, // Enable logging
  debug: true, // Enable debugging output
});

const resetPassword: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Update refresh token in the database
    await User.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } }
    );

    // Generate reset password link
    const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${accessToken}`;

    // Render the email template with ejs
    const templatePath = path.join(__dirname, "../templates/emailTemplate.ejs");
    const emailContent = await ejs.renderFile(templatePath, {
      name: user.name,
      resetPasswordLink,
      token: accessToken,
    });

    // Send email with reset password link
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: "Reset Your Password",
      html: emailContent,
    });

    res.json({ message: "Reset password link sent to your email" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const resetPasswordUpdate: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.params.token;
  const { password } = req.body;

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!verifyToken) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }

    const user = await User.findOne({
      where: { id: (verifyToken as jwt.JwtPayload).user?.id as string },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update user password
    const passwordHash = await bcrypt.hash(password, 10);

    await User.update({ password: passwordHash }, { where: { id: user.id } });

    res.json({ message: "Password reset successful" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { resetPassword, resetPasswordUpdate };
