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
exports.refreshToken = exports.getCurrentUser = exports.logoutUser = exports.registerUser = exports.loginUser = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
const hash_1 = require("../../utils/hash");
const token_1 = require("../../utils/token");
const token_2 = require("../../utils/token");
const auth_schema_1 = require("./auth.schema");
const genUsername_1 = require("../../utils/genUsername");
const logger_1 = __importDefault(require("../../config/logger"));
const userService = __importStar(require("./auth.service"));
exports.loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = auth_schema_1.loginSchema.parse(req.body);
    const user = await userService.findUserByEmail(email);
    if (!user) {
        throw new apiError_1.ApiError(404, "User not found");
    }
    const isPasswordValid = await (0, hash_1.comparePassword)(password, user.password);
    if (!isPasswordValid) {
        throw new apiError_1.ApiError(401, "Invalid credentials");
    }
    const accessToken = (0, token_1.generateAccessToken)(user.id);
    const refreshToken = (0, token_1.generateRefreshToken)(user.id);
    await userService.saveRefreshToken(user.id, refreshToken);
    logger_1.default.info("Refresh token saved", { userId: user.id });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env["NODE_ENV"] === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, {
        user: {
            username: user.username,
            email: user.email,
            role: user.role,
        },
        accessToken,
    }, "Login successful"));
    logger_1.default.info("User logged in", { userId: user.id });
});
const getWhitelistAdmins = () => {
    const raw = process.env["WHITELIST_ADMINS_MAIL"];
    if (!raw)
        return [];
    return raw.split(",").map((e) => e.trim().toLowerCase());
};
exports.registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, role } = auth_schema_1.registerSchema.parse(req.body);
    if (role === "admin" && !getWhitelistAdmins().includes(email.toLowerCase())) {
        throw new apiError_1.ApiError(403, "You cannot register as an admin");
    }
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
        throw new apiError_1.ApiError(409, "User with this email already exists");
    }
    const username = (0, genUsername_1.genUsername)();
    const hashedPassword = await (0, hash_1.hashPassword)(password);
    const user = await userService.createUser({
        username,
        email,
        password: hashedPassword,
        role,
    });
    const accessToken = (0, token_1.generateAccessToken)(user.id);
    const refreshToken = (0, token_1.generateRefreshToken)(user.id);
    await userService.saveRefreshToken(user.id, refreshToken);
    logger_1.default.info("Refresh token created for user", { userId: user.id });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env["NODE_ENV"] === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, {
        user: {
            username: user.username,
            email: user.email,
            role: user.role,
        },
        accessToken,
    }, "User registered successfully"));
    logger_1.default.info("User registered successfully", { userId: user.id });
});
exports.logoutUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
        await userService.deleteRefreshToken(refreshToken);
        logger_1.default.info("Refresh token deleted", { refreshToken });
    }
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env["NODE_ENV"] === "production",
        sameSite: "strict",
    });
    res.sendStatus(204);
    logger_1.default.info("User logged out");
});
exports.getCurrentUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.userId;
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
exports.refreshToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const token = req.cookies?.refreshToken;
    let payload;
    try {
        payload = (0, token_2.verifyRefreshToken)(token);
    }
    catch {
        throw new apiError_1.ApiError(401, "Invalid or expired refresh token");
    }
    const storedToken = await userService.findRefreshToken(token);
    if (!storedToken) {
        throw new apiError_1.ApiError(401, "Refresh token not found");
    }
    await userService.deleteRefreshToken(token);
    const accessToken = (0, token_1.generateAccessToken)(payload.sub);
    const newRefreshToken = (0, token_1.generateRefreshToken)(payload.sub);
    await userService.saveRefreshToken(payload.sub, newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env["NODE_ENV"] === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, { accessToken }, "Token refreshed successfully"));
    logger_1.default.info("Token refreshed", { userId: payload.sub });
});
//# sourceMappingURL=auth.controllers.js.map