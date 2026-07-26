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
exports.unlikeBlog = exports.likeBlog = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
const logger_1 = __importDefault(require("../../config/logger"));
const likeService = __importStar(require("./like.service"));
const getUserId = (req) => {
    return req.userId;
};
exports.likeBlog = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        throw new apiError_1.ApiError(401, "Not authenticated");
    }
    const { blogId } = req.params;
    const blog = await likeService.findBlogById(blogId);
    if (!blog) {
        throw new apiError_1.ApiError(404, "Blog not found");
    }
    const existingLike = await likeService.findExistingLike(blogId, userId);
    if (existingLike) {
        throw new apiError_1.ApiError(400, "You already liked this blog");
    }
    const result = await likeService.likeBlog(blogId, userId);
    logger_1.default.info("Blog liked", { userId, blogId, likesCount: result.likesCount });
    res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, { likesCount: result.likesCount }, "Blog liked successfully"));
});
exports.unlikeBlog = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        throw new apiError_1.ApiError(401, "Not authenticated");
    }
    const { blogId } = req.params;
    const result = await likeService.unlikeBlog(blogId, userId);
    if (!result) {
        throw new apiError_1.ApiError(400, "Like not found");
    }
    logger_1.default.info("Blog unliked", {
        userId,
        blogId,
        likesCount: result.likesCount,
    });
    res.sendStatus(204);
});
//# sourceMappingURL=like.controllers.js.map