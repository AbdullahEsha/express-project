import jwt from "jsonwebtoken";
import { userType } from "../types/userType";
import dotenv from "dotenv";

dotenv.config();

export const generateTokens = (user: userType) => {
  const accessToken = jwt.sign({ user }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  });

  const refreshToken = jwt.sign(
    { user },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string }
  );

  return { accessToken, refreshToken };
};
