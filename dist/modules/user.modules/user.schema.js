"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCurrentUserSchema = exports.userQuerySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userQuerySchema = zod_1.default.object({
    offset: zod_1.default.coerce.number().int().min(0).default(0),
    limit: zod_1.default.coerce.number().int().positive().max(50).default(10),
});
exports.updateCurrentUserSchema = zod_1.default.object({
    username: zod_1.default.string().min(1).optional(),
    email: zod_1.default.string().email().optional(),
    password: zod_1.default.string().min(6).optional(),
    firstName: zod_1.default.string().optional(),
    lastName: zod_1.default.string().optional(),
    website: zod_1.default.string().url().optional().or(zod_1.default.literal("")),
    facebook: zod_1.default.string().url().optional().or(zod_1.default.literal("")),
    instagram: zod_1.default.string().url().optional().or(zod_1.default.literal("")),
    linkedin: zod_1.default.string().url().optional().or(zod_1.default.literal("")),
    x: zod_1.default.string().url().optional().or(zod_1.default.literal("")),
    youtube: zod_1.default.string().url().optional().or(zod_1.default.literal("")),
});
//# sourceMappingURL=user.schema.js.map