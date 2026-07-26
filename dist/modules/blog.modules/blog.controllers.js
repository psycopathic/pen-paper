"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getBlogsByUser = exports.getBlogs = exports.getBlog = exports.createBlog = void 0;
const jsdom_1 = require("jsdom");
const dompurify_1 = __importDefault(require("dompurify"));
const asyncHandler_1 = require("../../utils/asyncHandler");
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
const blog_schema_1 = require("./blog.schema");
const logger_1 = __importDefault(require("../../config/logger"));
const blogService = __importStar(require("./blog.service"));
const window = new jsdom_1.JSDOM("").window;
const purify = (0, dompurify_1.default)(window);
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        + "-" + Date.now().toString(36);
};
const getUserId = (req) => {
    return req.userId;
};
exports.createBlog = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        throw new apiError_1.ApiError(401, "Not authenticated");
    }
    const { title, content, banner, status } = blog_schema_1.createBlogSchema.parse(req.body);
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
    logger_1.default.info("Blog created", { blogId: blog.id, userId });
    res
        .status(201)
        .json(new apiResponse_1.ApiResponse(201, { blog }, "Blog created successfully"));
});
exports.getBlog = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { slug } = req.params;
    const userId = getUserId(req);
    const blog = await blogService.findBlogBySlug(slug);
    if (!blog) {
        throw new apiError_1.ApiError(404, "Blog not found");
    }
    if (blog.status === "draft") {
        const userRole = userId ? await blogService.findUserRole(userId) : null;
        if (blog.authorId !== userId && userRole !== "admin") {
            throw new apiError_1.ApiError(403, "Access denied, insufficient permissions");
        }
    }
    await blogService.incrementBlogViews(blog.id);
    res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, { blog }, "Blog fetched successfully"));
});
exports.getBlogs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    const { offset, limit, status, search } = blog_schema_1.blogQuerySchema.parse(req.query);
    const userRole = userId ? await blogService.findUserRole(userId) : null;
    const where = {};
    if (!userRole || userRole === "user") {
        where.status = "published";
    }
    else if (status) {
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
    res.status(200).json(new apiResponse_1.ApiResponse(200, {
        limit,
        offset,
        total,
        blogs,
    }, "Blogs fetched successfully"));
});
exports.getBlogsByUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const currentUserId = getUserId(req);
    const { userId } = req.params;
    const { offset, limit, status } = blog_schema_1.blogQuerySchema.parse(req.query);
    const currentUserRole = currentUserId
        ? await blogService.findUserRole(currentUserId)
        : null;
    const where = { authorId: userId };
    if (!currentUserRole || currentUserRole === "user") {
        where.status = "published";
    }
    else if (status) {
        where.status = status;
    }
    const { blogs, total } = await blogService.findBlogs({
        skip: offset,
        take: limit,
        where,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, {
        limit,
        offset,
        total,
        blogs,
    }, "User blogs fetched successfully"));
});
exports.updateBlog = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        throw new apiError_1.ApiError(401, "Not authenticated");
    }
    const { slug } = req.params;
    const data = blog_schema_1.updateBlogSchema.parse(req.body);
    const existing = await blogService.findBlogBySlug(slug);
    if (!existing) {
        throw new apiError_1.ApiError(404, "Blog not found");
    }
    const userRole = await blogService.findUserRole(userId);
    if (existing.authorId !== userId && userRole !== "admin") {
        throw new apiError_1.ApiError(403, "Access denied, insufficient permissions");
    }
    const updateData = { ...data };
    if (data.content) {
        updateData.content = purify.sanitize(data.content);
    }
    if (data.status === "published" && existing.status === "draft") {
        updateData.publishedAt = new Date();
    }
    const blog = await blogService.updateBlog(existing.id, updateData);
    logger_1.default.info("Blog updated", { blogId: blog.id, userId });
    res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, { blog }, "Blog updated successfully"));
});
exports.deleteBlog = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        throw new apiError_1.ApiError(401, "Not authenticated");
    }
    const { slug } = req.params;
    const existing = await blogService.findBlogBySlug(slug);
    if (!existing) {
        throw new apiError_1.ApiError(404, "Blog not found");
    }
    const userRole = await blogService.findUserRole(userId);
    if (existing.authorId !== userId && userRole !== "admin") {
        throw new apiError_1.ApiError(403, "Access denied, insufficient permissions");
    }
    await blogService.deleteBlog(existing.id);
    logger_1.default.info("Blog deleted", { blogId: existing.id, userId });
    res.sendStatus(204);
});
//# sourceMappingURL=blog.controllers.js.map