import jwt from "jsonwebtoken";

const getSecret = (key: string): string => {
  const secret = process.env[key];
  if (!secret) throw new Error(`${key} is not defined in environment variables`);
  return secret;
};

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, getSecret("ACCESS_TOKEN_SECRET"), {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, getSecret("REFRESH_TOKEN_SECRET"), {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, getSecret("ACCESS_TOKEN_SECRET"));
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, getSecret("REFRESH_TOKEN_SECRET"));
};
