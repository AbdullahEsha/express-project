import bcrypt from "bcryptjs";
import pool from "../config/db";
import { Request, Response } from "express";
import { generateTokens } from "../helper";
import jwt from "jsonwebtoken";

// Register user
const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    const user = result.rows[0];

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Save refresh token in database
    await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      user.id,
    ]);

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const { accessToken, refreshToken } = generateTokens(user.id);

      // Update refresh token in the database
      await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
        refreshToken,
        user.id,
      ]);

      res.json({ message: "Login successful", accessToken, refreshToken });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Social login
const socialLogin = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    
    let user = result.rows[0];

    if (!user) {
      const newUserResult = await pool.query(
        "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *",
        [email, name]
      );
      user = newUserResult.rows[0];
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      user.id,
    ]);

    res.json({ message: "Login successful", accessToken, refreshToken });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Refresh token
const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });

  try {
    const payload: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    );

    // Verify that refresh token matches the one stored in the database
    const result = await pool.query(
      "SELECT refresh_token FROM users WHERE id = $1",
      [payload.userId]
    );
    const storedToken = result.rows[0]?.refresh_token;

    if (storedToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new access token (and optionally a new refresh token)
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      payload.userId
    );

    // Update the new refresh token in the database
    await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      newRefreshToken,
      payload.userId,
    ]);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

export { register, login, socialLogin, refreshToken };
