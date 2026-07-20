import { Router } from "express";
import { body, cookie } from "express-validator";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshToken,
} from "./auth.controllers";
import { authenticate } from "../../middlewares/authenticate";
import { validationError } from "../../middlewares/validationError";
import { authLimiter, createAccountLimiter } from "../../config/rateLimiter";

const router = Router();

router.post(
  "/register",
  createAccountLimiter,
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("role")
    .optional()
    .isIn(["admin", "user"])
    .withMessage("Role must be either admin or user"),
  validationError,
  registerUser,
);

router.post(
  "/login",
  authLimiter,
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validationError,
  loginUser,
);

router.post(
  "/refresh-token",
  cookie("refreshToken")
    .notEmpty()
    .withMessage("Refresh token required")
    .isJWT()
    .withMessage("Invalid refresh token"),
  validationError,
  refreshToken,
);

router.post(
  "/logout",
  authenticate,
  logoutUser,
);

export default router;
