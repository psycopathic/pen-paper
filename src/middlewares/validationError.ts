import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validationError = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: errors.array()[0]?.msg ?? "Validation error",
      errors: errors.array(),
    });
    return;
  }

  next();
};
