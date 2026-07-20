import type { Request, Response } from "express";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import { createBlogSchema, updateBlogSchema, blogQuerySchema } from "./blog.schema";
import logger from "../../config/logger";
import * as blogService from "./blog.service";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    + "-" + Date.now().toString(36);
};

const getUserId = (req: Request): string | undefined => {
  return (req as Request & { userId?: string }).userId;
};

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  if (!userId) {
    throw new ApiError(401, "Not authenticated");
  }

  const { title, content, banner, status } = createBlogSchema.parse(req.body);

  const cleanContent = purify.sanitize(content);
  const slug = generateSlug(title);

  const blog = await blogService.createBlog({
    title,
    slug,
    content: cleanContent,
    banner,
    status,
    authorId: userId,
  });

  logger.info("Blog created", { blogId: blog.id, userId });

  res
    .status(201)
    .json(new ApiResponse(201, { blog }, "Blog created successfully"));
});

export const getBlog = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params as { slug: string };
  const userId = getUserId(req);

  const blog = await blogService.findBlogBySlug(slug);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.status === "draft") {
    const userRole = userId ? await blogService.findUserRole(userId) : null;

    if (blog.authorId !== userId && userRole !== "admin") {
      throw new ApiError(403, "Access denied, insufficient permissions");
    }
  }

  await blogService.incrementBlogViews(blog.id);

  res
    .status(200)
    .json(new ApiResponse(200, { blog }, "Blog fetched successfully"));
});

export const getBlogs = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { offset, limit, status, search } = blogQuerySchema.parse(req.query);

  const userRole = userId ? await blogService.findUserRole(userId) : null;

  const where: Record<string, unknown> = {};

  if (!userRole || userRole === "user") {
    where.status = "published";
  } else if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const { blogs, total } = await blogService.findBlogs({
    skip: offset,
    take: limit,
    where,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        limit,
        offset,
        total,
        blogs,
      },
      "Blogs fetched successfully",
    ),
  );
});

export const getBlogsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUserId = getUserId(req);
    const { userId } = req.params as { userId: string };
    const { offset, limit, status } = blogQuerySchema.parse(req.query);

    const currentUserRole = currentUserId
      ? await blogService.findUserRole(currentUserId)
      : null;

    const where: Record<string, unknown> = { authorId: userId };

    if (!currentUserRole || currentUserRole === "user") {
      where.status = "published";
    } else if (status) {
      where.status = status;
    }

    const { blogs, total } = await blogService.findBlogs({
      skip: offset,
      take: limit,
      where,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          limit,
          offset,
          total,
          blogs,
        },
        "User blogs fetched successfully",
      ),
    );
  },
);

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  if (!userId) {
    throw new ApiError(401, "Not authenticated");
  }

  const { slug } = req.params as { slug: string };
  const data = updateBlogSchema.parse(req.body);

  const existing = await blogService.findBlogBySlug(slug);

  if (!existing) {
    throw new ApiError(404, "Blog not found");
  }

  const userRole = await blogService.findUserRole(userId);

  if (existing.authorId !== userId && userRole !== "admin") {
    throw new ApiError(403, "Access denied, insufficient permissions");
  }

  const updateData: Record<string, unknown> = { ...data };

  if (data.content) {
    updateData.content = purify.sanitize(data.content);
  }

  if (data.status === "published" && existing.status === "draft") {
    updateData.publishedAt = new Date();
  }

  const blog = await blogService.updateBlog(existing.id, updateData);

  logger.info("Blog updated", { blogId: blog.id, userId });

  res
    .status(200)
    .json(new ApiResponse(200, { blog }, "Blog updated successfully"));
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  if (!userId) {
    throw new ApiError(401, "Not authenticated");
  }

  const { slug } = req.params as { slug: string };

  const existing = await blogService.findBlogBySlug(slug);

  if (!existing) {
    throw new ApiError(404, "Blog not found");
  }

  const userRole = await blogService.findUserRole(userId);

  if (existing.authorId !== userId && userRole !== "admin") {
    throw new ApiError(403, "Access denied, insufficient permissions");
  }

  await blogService.deleteBlog(existing.id);

  logger.info("Blog deleted", { blogId: existing.id, userId });

  res.sendStatus(204);
});
