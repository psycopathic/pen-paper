import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import { createCommentSchema, commentQuerySchema } from "./comment.schema";
import logger from "../../config/logger";
import * as commentService from "./comment.service";

const getUserId = (req: Request): string | undefined => {
  return (req as Request & { userId?: string }).userId;
};

export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    if (!userId) {
      throw new ApiError(401, "Not authenticated");
    }

    const { blogId } = req.params as { blogId: string };
    const { content } = createCommentSchema.parse(req.body);

    const blog = await commentService.findBlogById(blogId);

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    const comment = await commentService.createComment({
      content,
      blogId: blog.id,
      userId,
    });

    logger.info("Comment created", { commentId: comment.id, blogId: blog.id });

    res
      .status(201)
      .json(new ApiResponse(201, { comment }, "Comment created successfully"));
  },
);

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    if (!userId) {
      throw new ApiError(401, "Not authenticated");
    }

    const { commentId } = req.params as { commentId: string };

    const comment = await commentService.findCommentById(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    const userRole = await commentService.findUserRole(userId);

    if (comment.userId !== userId && userRole !== "admin") {
      throw new ApiError(403, "Access denied, insufficient permissions");
    }

    await commentService.deleteComment(commentId);

    logger.info("Comment deleted", { commentId, userId });

    res.sendStatus(204);
  },
);

export const getCommentsByBlog = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params as { slug: string };

    const blog = await commentService.findBlogBySlug(slug);

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    const comments = await commentService.findCommentsByBlogId(blog.id);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { comments },
          "Comments fetched successfully",
        ),
      );
  },
);

export const getComments = asyncHandler(
  async (req: Request, res: Response) => {
    const { offset, limit } = commentQuerySchema.parse(req.query);

    const { comments, total } = await commentService.findComments({
      skip: offset,
      take: limit,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { offset, limit, total, comments },
          "Comments fetched successfully",
        ),
      );
  },
);
