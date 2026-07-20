import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token";
import { ApiError } from "../utils/apiError";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Access token is required");
  }

  try {
    const payload = verifyAccessToken(token) as { sub: string };
    (req as Request & { userId: string }).userId = payload.sub;
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }
};
