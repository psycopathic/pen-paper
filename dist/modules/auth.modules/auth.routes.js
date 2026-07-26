"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controllers_1 = require("./auth.controllers");
const authenticate_1 = require("../../middlewares/authenticate");
const validationError_1 = require("../../middlewares/validationError");
const rateLimiter_1 = require("../../config/rateLimiter");
const router = (0, express_1.Router)();
router.post("/register", rateLimiter_1.createAccountLimiter, (0, express_validator_1.body)("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .isEmail()
    .withMessage("Invalid email address"), (0, express_validator_1.body)("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"), (0, express_validator_1.body)("role")
    .optional()
    .isIn(["admin", "user"])
    .withMessage("Role must be either admin or user"), validationError_1.validationError, auth_controllers_1.registerUser);
router.post("/login", rateLimiter_1.authLimiter, (0, express_validator_1.body)("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .isEmail()
    .withMessage("Invalid email address"), (0, express_validator_1.body)("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"), validationError_1.validationError, auth_controllers_1.loginUser);
router.post("/refresh-token", (0, express_validator_1.cookie)("refreshToken")
    .notEmpty()
    .withMessage("Refresh token required")
    .isJWT()
    .withMessage("Invalid refresh token"), validationError_1.validationError, auth_controllers_1.refreshToken);
router.post("/logout", authenticate_1.authenticate, auth_controllers_1.logoutUser);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map