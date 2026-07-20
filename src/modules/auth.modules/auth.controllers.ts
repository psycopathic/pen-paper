import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import { comparePassword, hashPassword } from "../../utils/hash";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { verifyRefreshToken } from "../../utils/token";
import { registerSchema, loginSchema } from "./auth.schema";
import { genUsername } from "../../utils/genUsername";
import logger from "../../config/logger";
import * as userService from "./auth.service";

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await userService.findUserByEmail(email);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await userService.saveRefreshToken(user.id, refreshToken);
  logger.info("Refresh token saved", { userId: user.id });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
      "Login successful",
    ),
  );

  logger.info("User logged in", { userId: user.id });
});

const getWhitelistAdmins = (): string[] => {
  const raw = process.env["WHITELIST_ADMINS_MAIL"];
  if (!raw) return [];
  return raw.split(",").map((e) => e.trim().toLowerCase());
};

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, role } = registerSchema.parse(req.body);

  if (role === "admin" && !getWhitelistAdmins().includes(email.toLowerCase())) {
    throw new ApiError(403, "You cannot register as an admin");
  }

  const existingUser = await userService.findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const username = genUsername();
  const hashedPassword = await hashPassword(password);

  const user = await userService.createUser({
    username,
    email,
    password: hashedPassword,
    role,
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await userService.saveRefreshToken(user.id, refreshToken);
  logger.info("Refresh token created for user", { userId: user.id });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
      "User registered successfully",
    ),
  );

  logger.info("User registered successfully", { userId: user.id });
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken as string | undefined;

  if (refreshToken) {
    await userService.deleteRefreshToken(refreshToken);
    logger.info("Refresh token deleted", { refreshToken });
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "strict",
  });

  res.sendStatus(204);

  logger.info("User logged out");
});

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as Request & { userId?: string }).userId;

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

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken as string;

    let payload: { sub: string };
    try {
      payload = verifyRefreshToken(token) as { sub: string };
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const storedToken = await userService.findRefreshToken(token);

    if (!storedToken) {
      throw new ApiError(401, "Refresh token not found");
    }

    await userService.deleteRefreshToken(token);

    const accessToken = generateAccessToken(payload.sub);
    const newRefreshToken = generateRefreshToken(payload.sub);

    await userService.saveRefreshToken(payload.sub, newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        { accessToken },
        "Token refreshed successfully",
      ),
    );

    logger.info("Token refreshed", { userId: payload.sub });
  },
);
