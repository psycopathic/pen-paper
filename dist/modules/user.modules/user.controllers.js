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
exports.updateCurrentUser = exports.deleteUser = exports.deleteCurrentUser = exports.getAllUsers = exports.getUser = exports.getCurrentUser = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
const hash_1 = require("../../utils/hash");
const user_schema_1 = require("./user.schema");
const logger_1 = __importDefault(require("../../config/logger"));
const userService = __importStar(require("./user.service"));
const getUserId = (req) => {
    return req.userId;
};
exports.getCurrentUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        throw new apiError_1.ApiError(401, "Not authenticated");
    }
    const user = await userService.findUserById(userId);
    if (!user) {
        throw new apiError_1.ApiError(404, "User not found");
    }
    res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, { user }, "User fetched successfully"));
});
exports.getUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    const user = await userService.findUserById(userId);
    if (!user) {
        throw new apiError_1.ApiError(404, "User not found");
    }
    res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, { user }, "User fetched successfully"));
});
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { offset, limit } = user_schema_1.userQuerySchema.parse(req.query);
    const { users, total } = await userService.findUsers({
        skip: offset,
        take: limit,
    });
    res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, { offset, limit, total, users }, "Users fetched successfully"));
});
exports.deleteCurrentUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        throw new apiError_1.ApiError(401, "Not authenticated");
    }
    await userService.deleteUserWithBlogs(userId);
    logger_1.default.info("User account and blogs deleted", { userId });
    res.sendStatus(204);
});
exports.deleteUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    await userService.deleteUserWithBlogs(userId);
    logger_1.default.info("User account and blogs deleted", { userId });
    res.sendStatus(204);
});
exports.updateCurrentUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        throw new apiError_1.ApiError(401, "Not authenticated");
    }
    const body = user_schema_1.updateCurrentUserSchema.parse(req.body);
    const user = await userService.findUserById(userId);
    if (!user) {
        throw new apiError_1.ApiError(404, "User not found");
    }
    const updateData = {};
    if (body.username)
        updateData.username = body.username;
    if (body.email)
        updateData.email = body.email;
    if (body.password)
        updateData.password = await (0, hash_1.hashPassword)(body.password);
    if (body.firstName !== undefined)
        updateData.firstName = body.firstName || null;
    if (body.lastName !== undefined)
        updateData.lastName = body.lastName || null;
    const currentSocialLinks = user.socialLinks || {};
    const socialLinks = { ...currentSocialLinks };
    if (body.website !== undefined)
        socialLinks.website = body.website;
    if (body.facebook !== undefined)
        socialLinks.facebook = body.facebook;
    if (body.instagram !== undefined)
        socialLinks.instagram = body.instagram;
    if (body.linkedin !== undefined)
        socialLinks.linkedin = body.linkedin;
    if (body.x !== undefined)
        socialLinks.x = body.x;
    if (body.youtube !== undefined)
        socialLinks.youtube = body.youtube;
    updateData.socialLinks = socialLinks;
    const updatedUser = await userService.updateUser(userId, updateData);
    logger_1.default.info("User updated", { userId });
    res
        .status(200)
        .json(new apiResponse_1.ApiResponse(200, { user: updatedUser }, "User updated successfully"));
});
//# sourceMappingURL=user.controllers.js.map