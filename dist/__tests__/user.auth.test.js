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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const zod_1 = require("zod");
const apiError_1 = require("../utils/apiError");
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
    authenticate: (_req, _res, next) => {
        next();
    },
}));
const auth_routes_1 = __importDefault(require("../modules/auth.modules/auth.routes"));
const userService = __importStar(require("../modules/auth.modules/auth.service"));
const hash_1 = require("../utils/hash");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use("/api/users", auth_routes_1.default);
    app.use((err, _req, res, _next) => {
        if (err instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: err.issues[0]?.message ?? "Validation error",
            });
            return;
        }
        if (err instanceof apiError_1.ApiError) {
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
    let app;
    beforeEach(() => {
        jest.clearAllMocks();
        app = createApp();
    });
    const mockUser = {
        id: "user-uuid-1",
        username: "testuser01",
        email: "test@example.com",
        password: "hashed_password",
        role: "user",
    };
    describe("POST /api/users/register", () => {
        it("should register a new user and return tokens", async () => {
            userService.findUserByEmail.mockResolvedValue(null);
            userService.createUser.mockResolvedValue(mockUser);
            userService.saveRefreshToken.mockResolvedValue(undefined);
            const res = await (0, supertest_1.default)(app)
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
            const res = await (0, supertest_1.default)(app)
                .post("/api/users/register")
                .send({ email: "hacker@example.com", password: "password123", role: "admin" });
            expect(res.status).toBe(403);
            expect(res.body.message).toContain("admin");
        });
        it("should allow whitelisted admin registration", async () => {
            userService.findUserByEmail.mockResolvedValue(null);
            userService.createUser.mockResolvedValue({
                ...mockUser,
                email: "admin@example.com",
                role: "admin",
            });
            userService.saveRefreshToken.mockResolvedValue(undefined);
            const res = await (0, supertest_1.default)(app)
                .post("/api/users/register")
                .send({ email: "admin@example.com", password: "password123", role: "admin" });
            expect(res.status).toBe(201);
            expect(res.body.data.user.role).toBe("admin");
        });
        it("should reject duplicate email", async () => {
            userService.findUserByEmail.mockResolvedValue(mockUser);
            const res = await (0, supertest_1.default)(app)
                .post("/api/users/register")
                .send({ email: "test@example.com", password: "password123" });
            expect(res.status).toBe(409);
            expect(res.body.message).toContain("email already exists");
        });
        it("should validate required fields", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/api/users/register")
                .send({ password: "short" });
            expect(res.status).toBe(400);
        });
    });
    describe("POST /api/users/login", () => {
        it("should login and return tokens", async () => {
            userService.findUserByEmail.mockResolvedValue(mockUser);
            userService.saveRefreshToken.mockResolvedValue(undefined);
            const res = await (0, supertest_1.default)(app)
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
            userService.findUserByEmail.mockResolvedValue(null);
            const res = await (0, supertest_1.default)(app)
                .post("/api/users/login")
                .send({ email: "unknown@example.com", password: "password123" });
            expect(res.status).toBe(404);
            expect(res.body.message).toContain("not found");
        });
        it("should return 401 for wrong password", async () => {
            userService.findUserByEmail.mockResolvedValue(mockUser);
            hash_1.comparePassword.mockResolvedValueOnce(false);
            const res = await (0, supertest_1.default)(app)
                .post("/api/users/login")
                .send({ email: "test@example.com", password: "wrongpassword" });
            expect(res.status).toBe(401);
            expect(res.body.message).toContain("Invalid credentials");
        });
        it("should validate login fields", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/api/users/login")
                .send({ email: "not-an-email" });
            expect(res.status).toBe(400);
        });
    });
    describe("POST /api/users/logout", () => {
        const validJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
        it("should clear the refresh token cookie", async () => {
            const res = await (0, supertest_1.default)(app)
                .post("/api/users/logout")
                .set("Cookie", [`refreshToken=${validJwt}`]);
            expect(res.status).toBe(204);
            expect(userService.deleteRefreshToken).toHaveBeenCalledWith(validJwt);
        });
        it("should succeed even without a refresh token cookie", async () => {
            const res = await (0, supertest_1.default)(app).post("/api/users/logout");
            expect(res.status).toBe(204);
            expect(userService.deleteRefreshToken).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=user.auth.test.js.map