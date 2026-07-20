import { Router } from "express";
import { body, query, param } from "express-validator";
import {
  createBlog,
  getBlogs,
  getBlogsByUser,
  getBlog,
  updateBlog,
  deleteBlog,
} from "./blog.controllers";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { validationError } from "../../middlewares/validationError";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 180 })
    .withMessage("Title must be less than 180 characters"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be draft or published"),
  validationError,
  createBlog,
);

router.get(
  "/",
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 to 50"),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a positive integer"),
  validationError,
  getBlogs,
);

router.get(
  "/user/:userId",
  param("userId").isUUID().withMessage("Invalid user ID"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 to 50"),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a positive integer"),
  validationError,
  getBlogsByUser,
);

router.get(
  "/:slug",
  param("slug").notEmpty().withMessage("Slug is required"),
  validationError,
  getBlog,
);

router.put(
  "/:slug",
  authenticate,
  authorize(["admin"]),
  body("title")
    .optional()
    .isLength({ max: 180 })
    .withMessage("Title must be less than 180 characters"),
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be draft or published"),
  validationError,
  updateBlog,
);

router.delete("/:slug", authenticate, authorize(["admin"]), deleteBlog);

export default router;
