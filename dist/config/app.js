"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const zod_1 = require("zod");
const sentry_1 = require("./sentry");
const cors_2 = require("./cors");
const rateLimiter_1 = require("./rateLimiter");
const auth_routes_1 = __importDefault(require("../modules/auth.modules/auth.routes"));
const blog_routes_1 = __importDefault(require("../modules/blog.modules/blog.routes"));
const comment_routes_1 = __importDefault(require("../modules/comment.modules/comment.routes"));
const like_routes_1 = __importDefault(require("../modules/like.modules/like.routes"));
const user_routes_1 = __importDefault(require("../modules/user.modules/user.routes"));
const apiError_1 = require("../utils/apiError");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use(rateLimiter_1.apiLimiter);
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/blogs", blog_routes_1.default);
app.use("/api/comments", comment_routes_1.default);
app.use("/api/likes", like_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
if (process.env.NODE_ENV !== "production") {
    app.get("/debug-sentry", () => {
        throw new Error("Sentry test error");
    });
}
sentry_1.Sentry.setupExpressErrorHandler(app);
app.use((err, _req, res, _next) => {
    if (err instanceof apiError_1.ApiError) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            data: null,
            message: err.message,
            success: false,
            errors: err.errors,
        });
        return;
    }
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            statusCode: 400,
            data: null,
            message: err.issues[0]?.message ?? "Validation failed",
            success: false,
            errors: err.issues,
        });
        return;
    }
    res.status(500).json({
        error: "Internal Server Error",
        eventId: res.sentry,
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map