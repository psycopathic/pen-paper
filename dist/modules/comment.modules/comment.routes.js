"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const comment_controllers_1 = require("./comment.controllers");
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const validationError_1 = require("../../middlewares/validationError");
const router = (0, express_1.Router)();
router.post("/blog/:blogId", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin", "user"]), (0, express_validator_1.param)("blogId").isUUID().withMessage("Invalid blog ID"), (0, express_validator_1.body)("content").notEmpty().withMessage("Content is required"), validationError_1.validationError, comment_controllers_1.createComment);
router.get("/", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin"]), comment_controllers_1.getComments);
router.get("/blog/:slug", comment_controllers_1.getCommentsByBlog);
router.delete("/:commentId", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin", "user"]), comment_controllers_1.deleteComment);
exports.default = router;
//# sourceMappingURL=comment.routes.js.map