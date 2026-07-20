import { Router } from "express";
import { body, param } from "express-validator";
import {
  createComment,
  deleteComment,
  getCommentsByBlog,
  getComments,
} from "./comment.controllers";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { validationError } from "../../middlewares/validationError";

const router = Router();

router.post(
  "/blog/:blogId",
  authenticate,
  authorize(["admin", "user"]),
  param("blogId").isUUID().withMessage("Invalid blog ID"),
  body("content").notEmpty().withMessage("Content is required"),
  validationError,
  createComment,
);

router.get("/", authenticate, authorize(["admin"]), getComments);

router.get("/blog/:slug", getCommentsByBlog);

router.delete("/:commentId", authenticate, authorize(["admin", "user"]), deleteComment);

export default router;
