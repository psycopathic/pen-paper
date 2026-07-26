"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = exports.createUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUserSchema = zod_1.default.object({
    username: zod_1.default.string().min(1, "Username is required"),
    email: zod_1.default.string().email("Invalid email address"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters long"),
    role: zod_1.default.string().default("user"),
    firstName: zod_1.default.string().nullable().optional(),
    lastName: zod_1.default.string().nullable().optional(),
    socialLinks: zod_1.default.record(zod_1.default.string(), zod_1.default.string()).nullable().optional(),
});
exports.registerSchema = zod_1.default.object({
    email: zod_1.default.string().email("Invalid email address"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters long"),
    role: zod_1.default.string().default("user"),
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string().email("Invalid email address"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters long"),
});
exports.updateUserSchema = exports.createUserSchema.partial();
exports.userSchema = exports.createUserSchema.extend({
    id: zod_1.default.string().uuid(),
    createdAt: zod_1.default.date(),
    updatedAt: zod_1.default.date(),
});
//# sourceMappingURL=auth.schema.js.map