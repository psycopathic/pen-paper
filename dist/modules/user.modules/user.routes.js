"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controllers_1 = require("./user.controllers");
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const validationError_1 = require("../../middlewares/validationError");
const router = (0, express_1.Router)();
router.get("/current", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin", "user"]), user_controllers_1.getCurrentUser);
router.put("/current", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin", "user"]), (0, express_validator_1.body)("username")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Username must be less than 20 characters"), (0, express_validator_1.body)("email")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .isEmail()
    .withMessage("Invalid email address"), (0, express_validator_1.body)("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"), (0, express_validator_1.body)("firstName")
    .optional()
    .isLength({ max: 20 })
    .withMessage("First name must be less than 20 characters"), (0, express_validator_1.body)("lastName")
    .optional()
    .isLength({ max: 20 })
    .withMessage("Last name must be less than 20 characters"), (0, express_validator_1.body)(["website", "facebook", "instagram", "linkedin", "x", "youtube"])
    .optional()
    .isURL()
    .withMessage("Invalid URL")
    .isLength({ max: 100 })
    .withMessage("URL must be less than 100 characters"), validationError_1.validationError, user_controllers_1.updateCurrentUser);
router.delete("/current", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin", "user"]), user_controllers_1.deleteCurrentUser);
router.get("/", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin"]), (0, express_validator_1.query)("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 to 50"), (0, express_validator_1.query)("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a positive integer"), validationError_1.validationError, user_controllers_1.getAllUsers);
router.get("/:userId", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin"]), (0, express_validator_1.param)("userId").isUUID().withMessage("Invalid user ID"), validationError_1.validationError, user_controllers_1.getUser);
router.delete("/:userId", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin"]), (0, express_validator_1.param)("userId").isUUID().withMessage("Invalid user ID"), validationError_1.validationError, user_controllers_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map