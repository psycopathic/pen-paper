import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import { hashPassword } from "../../utils/hash";
import { userQuerySchema, updateCurrentUserSchema } from "./user.schema";
import logger from "../../config/logger";
import * as userService from "./user.service";

const getUserId = (req: Request): string | undefined => {
  return (req as Request & { userId?: string }).userId;
};

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    if (!userId) {
      throw new ApiError(401, "Not authenticated");
    }

    const user = await userService.findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, { user }, "User fetched successfully"));
  },
);

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };

  const user = await userService.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { user }, "User fetched successfully"));
});

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const { offset, limit } = userQuerySchema.parse(req.query);

    const { users, total } = await userService.findUsers({
      skip: offset,
      take: limit,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { offset, limit, total, users },
          "Users fetched successfully",
        ),
      );
  },
);

export const deleteCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    if (!userId) {
      throw new ApiError(401, "Not authenticated");
    }

    await userService.deleteUserWithBlogs(userId);

    logger.info("User account and blogs deleted", { userId });

    res.sendStatus(204);
  },
);

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId: string };

  await userService.deleteUserWithBlogs(userId);

  logger.info("User account and blogs deleted", { userId });

  res.sendStatus(204);
});

export const updateCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);

    if (!userId) {
      throw new ApiError(401, "Not authenticated");
    }

    const body = updateCurrentUserSchema.parse(req.body);

    const user = await userService.findUserById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const updateData: Record<string, unknown> = {};

    if (body.username) updateData.username = body.username;
    if (body.email) updateData.email = body.email;
    if (body.password) updateData.password = await hashPassword(body.password);
    if (body.firstName !== undefined) updateData.firstName = body.firstName || null;
    if (body.lastName !== undefined) updateData.lastName = body.lastName || null;

    const currentSocialLinks = (user.socialLinks as Record<string, string>) || {};
    const socialLinks: Record<string, string> = { ...currentSocialLinks };

    if (body.website !== undefined) socialLinks.website = body.website;
    if (body.facebook !== undefined) socialLinks.facebook = body.facebook;
    if (body.instagram !== undefined) socialLinks.instagram = body.instagram;
    if (body.linkedin !== undefined) socialLinks.linkedin = body.linkedin;
    if (body.x !== undefined) socialLinks.x = body.x;
    if (body.youtube !== undefined) socialLinks.youtube = body.youtube;

    updateData.socialLinks = socialLinks;

    const updatedUser = await userService.updateUser(userId, updateData);

    logger.info("User updated", { userId });

    res
      .status(200)
      .json(
        new ApiResponse(200, { user: updatedUser }, "User updated successfully"),
      );
  },
);
