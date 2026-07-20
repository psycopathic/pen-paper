import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import logger from "../../config/logger";
import * as likeService from "./like.service";

const getUserId = (req: Request): string | undefined => {
  return (req as Request & { userId?: string }).userId;
};

export const likeBlog = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  if (!userId) {
    throw new ApiError(401, "Not authenticated");
  }

  const { blogId } = req.params as { blogId: string };

  const blog = await likeService.findBlogById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const existingLike = await likeService.findExistingLike(blogId, userId);

  if (existingLike) {
    throw new ApiError(400, "You already liked this blog");
  }

  const result = await likeService.likeBlog(blogId, userId);

  logger.info("Blog liked", { userId, blogId, likesCount: result.likesCount });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likesCount: result.likesCount },
        "Blog liked successfully",
      ),
    );
});

export const unlikeBlog = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  if (!userId) {
    throw new ApiError(401, "Not authenticated");
  }

  const { blogId } = req.params as { blogId: string };

  const result = await likeService.unlikeBlog(blogId, userId);

  if (!result) {
    throw new ApiError(400, "Like not found");
  }

  logger.info("Blog unliked", {
    userId,
    blogId,
    likesCount: result.likesCount,
  });

  res.sendStatus(204);
});
