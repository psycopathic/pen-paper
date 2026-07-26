"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentQuerySchema = exports.createCommentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createCommentSchema = zod_1.default.object({
    content: zod_1.default.string().min(1, "Content is required").max(2000),
});
exports.commentQuerySchema = zod_1.default.object({
    offset: zod_1.default.coerce.number().int().min(0).default(0),
    limit: zod_1.default.coerce.number().int().positive().max(50).default(10),
});
//# sourceMappingURL=comment.schema.js.map