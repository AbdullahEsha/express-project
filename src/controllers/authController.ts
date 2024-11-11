import bcrypt from "bcryptjs";
import User from "../models/User";
import { Request, Response, RequestHandler } from "express";
import { generateTokens } from "../helper";
import jwt from "jsonwebtoken";
import { userType } from "../types/userType";
import dotenv from "dotenv";

dotenv.config();

// Register user
const register: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userData = req.body;

  // Trim email to avoid spaces affecting uniqueness
  const email = userData.email.trim().toLowerCase();
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  try {
    // Check if user with email already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(400).json({
        error: "User with this email already exists",
      });
      return;
    }

    // Create user
    const result = await User.create({
      ...userData,
      email,
      role: "user",
      password: hashedPassword,
    });

    // Prepare user data for response (omit password)
    const user = result.get({ plain: true });
    delete user.password;

    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
};

// Login user
const login: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.getDataValue("password")
    );

    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Prepare user data for response (omit password)
    const userData = user.get({ plain: true });
    delete userData.password;

    const userForToken: userType = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    const { accessToken, refreshToken } = generateTokens(userForToken);

    // Update refresh token in the database
    const result = await User.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } }
    );

    if (!result) {
      res.status(500).json({ error: "An error occurred while logging in" });
      return;
    }

    res.json({ message: "Login successful", accessToken, refreshToken });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Social login
const socialLogin = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  try {
    const result = await User.findOne({ where: { email } });

    if (!result) {
      const password = Math.random().toString(36).substring(7);
      const user = await User.create({
        email,
        name,
        password: await bcrypt.hash(password, 10),
        role: "user",
      });

      const userForToken: userType = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const { accessToken, refreshToken } = generateTokens(userForToken);

      await User.update(
        { refresh_token: refreshToken },
        { where: { id: user.id } }
      );

      res.json({ message: "Login successful", accessToken, refreshToken });
    } else {
      const userForToken: userType = {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      };

      const { accessToken, refreshToken } = generateTokens(userForToken);

      await User.update(
        { refresh_token: refreshToken },
        { where: { id: result.id } }
      );

      res.json({ message: "Login successful", accessToken, refreshToken });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Refresh token
const refreshToken: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    res.status(401).json({ message: "Refresh token required" });

  try {
    const payload: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    );

    // Verify that refresh token matches the one stored in the database
    const result = await User.findByPk(payload.id);
    const storedToken = result?.getDataValue("refreshToken");

    if (storedToken !== refreshToken) {
      res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new access token (and optionally a new refresh token)
    const { accessToken, refreshToken: newRefreshToken } =
      generateTokens(payload);

    // Update the new refresh token in the database
    await User.update(
      { refreshToken: newRefreshToken },
      { where: { id: payload.id } }
    );

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

const logout: RequestHandler = async (req: Request, res: Response) => {
  const accessToken = req.header("Authorization")?.split(" ")[1];

  if (!accessToken) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  try {
    const payload: any = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    );
    const user = await User.findByPk(payload.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await User.update({ refreshToken: null }, { where: { id: user.id } });

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(403).json({ message: "Invalid access token" });
  }
};

export { register, login, socialLogin, refreshToken, logout };
