"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogQuerySchema = exports.updateBlogSchema = exports.createBlogSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createBlogSchema = zod_1.default.object({
    title: zod_1.default.string().min(1, "Title is required").max(200),
    content: zod_1.default.string().min(1, "Content is required"),
    banner: zod_1.default.record(zod_1.default.string(), zod_1.default.string()),
    status: zod_1.default.enum(["draft", "published"]).default("draft"),
});
exports.updateBlogSchema = exports.createBlogSchema.partial();
exports.blogQuerySchema = zod_1.default.object({
    offset: zod_1.default.coerce.number().int().min(0).default(0),
    limit: zod_1.default.coerce.number().int().positive().max(50).default(10),
    status: zod_1.default.enum(["draft", "published"]).optional(),
    search: zod_1.default.string().optional(),
});
//# sourceMappingURL=blog.schema.js.map