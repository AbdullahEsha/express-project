import jwt from "jsonwebtoken";

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  });

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string }
  );

  return { accessToken, refreshToken };
};
