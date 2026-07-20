import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { findUserRole } from "../modules/auth.modules/auth.service";

export const authorize = (roles: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = (req as Request & { userId?: string }).userId;

      if (!userId) {
        throw new ApiError(401, "Not authenticated");
      }

      const userRole = await findUserRole(userId);

      if (!userRole || !roles.includes(userRole)) {
        throw new ApiError(403, "Access denied, insufficient permissions");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
