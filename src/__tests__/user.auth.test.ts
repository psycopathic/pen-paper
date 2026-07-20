import request from "supertest";
import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cookieParser from "cookie-parser";
import { ZodError } from "zod";
import { ApiError } from "../utils/apiError";

jest.mock("../config/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

jest.mock("../modules/auth.modules/auth.service", () => ({
  findUserByEmail: jest.fn(),
  findUserByUsername: jest.fn(),
  findUserById: jest.fn(),
  createUser: jest.fn(),
  saveRefreshToken: jest.fn(),
  deleteRefreshToken: jest.fn(),
}));

jest.mock("../utils/hash", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashed_password"),
  comparePassword: jest.fn().mockResolvedValue(true),
}));

jest.mock("../utils/token", () => ({
  generateAccessToken: jest.fn().mockReturnValue("mock-access-token"),
  generateRefreshToken: jest.fn().mockReturnValue("mock-refresh-token"),
}));

jest.mock("../utils/genUsername", () => ({
  genUsername: jest.fn().mockReturnValue("testuser01"),
}));

jest.mock("../middlewares/authenticate", () => ({
  authenticate: (_req: Record<string, unknown>, _res: Record<string, unknown>, next: () => void) => {
    next();
  },
}));

import userRoutes from "../modules/auth.modules/auth.routes";
import * as userService from "../modules/auth.modules/auth.service";
import { comparePassword } from "../utils/hash";

const createApp = (): Express => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/users", userRoutes);

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: err.issues[0]?.message ?? "Validation error",
      });
      return;
    }
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors,
      });
      return;
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  });

  return app;
};

describe("User Auth API", () => {
  let app: Express;

  beforeEach(() => {
    jest.clearAllMocks();
    app = createApp();
  });

  const mockUser: Record<string, string> = {
    id: "user-uuid-1",
    username: "testuser01",
    email: "test@example.com",
    password: "hashed_password",
    role: "user",
  };

  describe("POST /api/users/register", () => {
    it("should register a new user and return tokens", async () => {
      (userService.findUserByEmail as jest.Mock).mockResolvedValue(null);
      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);
      (userService.saveRefreshToken as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app)
        .post("/api/users/register")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.username).toBe("testuser01");
      expect(res.body.data.user.email).toBe("test@example.com");
      expect(res.body.data.accessToken).toBe("mock-access-token");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should block non-whitelisted admin registration", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({ email: "hacker@example.com", password: "password123", role: "admin" });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain("admin");
    });

    it("should allow whitelisted admin registration", async () => {
      (userService.findUserByEmail as jest.Mock).mockResolvedValue(null);
      (userService.createUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        email: "admin@example.com",
        role: "admin",
      });
      (userService.saveRefreshToken as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app)
        .post("/api/users/register")
        .send({ email: "admin@example.com", password: "password123", role: "admin" });

      expect(res.status).toBe(201);
      expect(res.body.data.user.role).toBe("admin");
    });

    it("should reject duplicate email", async () => {
      (userService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .post("/api/users/register")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain("email already exists");
    });

    it("should validate required fields", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({ password: "short" });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/users/login", () => {
    it("should login and return tokens", async () => {
      (userService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (userService.saveRefreshToken as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.username).toBe("testuser01");
      expect(res.body.data.user.email).toBe("test@example.com");
      expect(res.body.data.accessToken).toBe("mock-access-token");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return 404 for unknown user", async () => {
      (userService.findUserByEmail as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "unknown@example.com", password: "password123" });

      expect(res.status).toBe(404);
      expect(res.body.message).toContain("not found");
    });

    it("should return 401 for wrong password", async () => {
      (userService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValueOnce(false);

      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "test@example.com", password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain("Invalid credentials");
    });

    it("should validate login fields", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "not-an-email" });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/users/logout", () => {
    const validJwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";

    it("should clear the refresh token cookie", async () => {
      const res = await request(app)
        .post("/api/users/logout")
        .set("Cookie", [`refreshToken=${validJwt}`]);

      expect(res.status).toBe(204);
      expect(userService.deleteRefreshToken).toHaveBeenCalledWith(validJwt);
    });

    it("should succeed even without a refresh token cookie", async () => {
      const res = await request(app).post("/api/users/logout");

      expect(res.status).toBe(204);
      expect(userService.deleteRefreshToken).not.toHaveBeenCalled();
    });
  });
});
