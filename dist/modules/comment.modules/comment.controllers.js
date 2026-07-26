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
exports.getComments = exports.getCommentsByBlog = exports.deleteComment = exports.createComment = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
const comment_schema_1 = require("./comment.schema");
const logger_1 = __importDefault(require("../../config/logger"));
const commentService = __importStar(require("./comment.service"));
const getUserId = (req) => {
    return req.userId;
};
exports.createComment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        throw new apiError_1.ApiError(401, "Not authenticated");
    }
    const { blogId } = req.params;
    const { content } = comment_schema_1.createCommentSchema.parse(req.body);
    const blog = await commentService.findBlogById(blogId);
    if (!blog) {
        throw new apiError_1.ApiError(404, "Blog not found");
    }
    const comment = await commentService.createComment({
        content,
        blogId: blog.id,
        userId,
    });
    logger_1.default.info("Comment created", { commentId: comment.id, blogId: blog.id });
    res
        .status(201)
        .json(new apiResponse_1.ApiResponse(201, { comment }, "Comment created successfully"));
});
exports.deleteComment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        throw new apiError_1.ApiError(401, "Not authenticated");
    }
    const { commentId } = req.params;
    const comment = await commentService.findCommentById(commentId);
    if (!comment) {
        throw new apiError_1.ApiError(404, "Comment not found");
    }
    const userRole = await commentService.findUserRole(userId);
    if (comment.userId !== userId && userRole !== "admin") {
        throw new apiError_1.ApiError(403, "Access denied, insufficient permissions");
    }
    await commentService.deleteComment(commentId);
    logger_1.default.info("Comment deleted", { commentId, userId });
    res.sendStatus(204);
});
exports.getCommentsByBlog = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { slug } = req.params;
    const blog = await commentService.findBlogBySlug(slug);
    if (!blog) {
        throw new apiError_1.ApiError(404, "Blog not found");
    }
    const comments = await commentService.findCommentsByBlogId(blog.id);
    res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, { comments }, "Comments fetched successfully"));
});
exports.getComments = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { offset, limit } = comment_schema_1.commentQuerySchema.parse(req.query);
    const { comments, total } = await commentService.findComments({
        skip: offset,
        take: limit,
    });
    res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, { offset, limit, total, comments }, "Comments fetched successfully"));
});
//# sourceMappingURL=comment.controllers.js.map