import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../config/db";
import { generateTokens } from "../helper";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = { userId: (verified as any).userId }; // Attach userId to req.user
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({ message: "Access token expired. Please refresh the token." });
    }
    res.status(403).json({ message: "Invalid access token." });
  }
};

// auth as admin
const authAsAdmin = async (req: Request, res: Response, next: any) => {
  const userId = req.user?.userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const result = await pool.query(
      "SELECT is_admin FROM users WHERE id = $1",
      [userId]
    );
    const isAdmin = result.rows[0]?.is_admin;

    if (!isAdmin) return res.status(403).json({ message: "Forbidden" });

    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export { authenticateToken, authAsAdmin };
