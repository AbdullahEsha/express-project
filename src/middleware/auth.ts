import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { userType } from "../types/userType";

// Extend the Request interface
declare global {
  namespace Express {
    interface Request {
      user: userType;
    }
  }
}

// Authenticate token
const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);

    // impliment refresh token
    if (verified) {
      req.user = verified as userType;
    }

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res
        .status(403)
        .json({ message: "Access token expired. Please refresh the token." });
    } else {
      res.status(403).json({ message: "Invalid access token." });
    }
    return;
  }
};

export { authenticateToken };
