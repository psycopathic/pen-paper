"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const blog_controllers_1 = require("./blog.controllers");
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const validationError_1 = require("../../middlewares/validationError");
const router = (0, express_1.Router)();
router.post("/", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin"]), (0, express_validator_1.body)("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 180 })
    .withMessage("Title must be less than 180 characters"), (0, express_validator_1.body)("content").trim().notEmpty().withMessage("Content is required"), (0, express_validator_1.body)("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be draft or published"), validationError_1.validationError, blog_controllers_1.createBlog);
router.get("/", (0, express_validator_1.query)("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 to 50"), (0, express_validator_1.query)("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a positive integer"), validationError_1.validationError, blog_controllers_1.getBlogs);
router.get("/user/:userId", (0, express_validator_1.param)("userId").isUUID().withMessage("Invalid user ID"), (0, express_validator_1.query)("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 to 50"), (0, express_validator_1.query)("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a positive integer"), validationError_1.validationError, blog_controllers_1.getBlogsByUser);
router.get("/:slug", (0, express_validator_1.param)("slug").notEmpty().withMessage("Slug is required"), validationError_1.validationError, blog_controllers_1.getBlog);
router.put("/:slug", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin"]), (0, express_validator_1.body)("title")
    .optional()
    .isLength({ max: 180 })
    .withMessage("Title must be less than 180 characters"), (0, express_validator_1.body)("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be draft or published"), validationError_1.validationError, blog_controllers_1.updateBlog);
router.delete("/:slug", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin"]), blog_controllers_1.deleteBlog);
exports.default = router;
//# sourceMappingURL=blog.routes.js.map