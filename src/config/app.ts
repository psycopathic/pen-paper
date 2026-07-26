import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ZodError } from "zod";
import { Sentry } from "./sentry";
import { corsOptions } from "./cors";
import { apiLimiter } from "./rateLimiter";
import logger from "./logger";
import authRoutes from "../modules/auth.modules/auth.routes";
import blogRoutes from "../modules/blog.modules/blog.routes";
import commentRoutes from "../modules/comment.modules/comment.routes";
import likeRoutes from "../modules/like.modules/like.routes";
import userRoutes from "../modules/user.modules/user.routes";
import { ApiError } from "../utils/apiError";

const app = express();

app.set("trust proxy", 1);
app.use(apiLimiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

if (process.env.NODE_ENV !== "production") {
    app.get("/debug-sentry", () => {
        throw new Error("Sentry test error");
    });
}

Sentry.setupExpressErrorHandler(app);

app.use((err: Error, _req: express.Request, res: express.Response & { sentry?: string }, _next: express.NextFunction) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            data: null,
            message: err.message,
            success: false,
            errors: err.errors,
        });
        return;
    }

    if (err instanceof ZodError) {
        res.status(400).json({
            statusCode: 400,
            data: null,
            message: err.issues[0]?.message ?? "Validation failed",
            success: false,
            errors: err.issues,
        });
        return;
    }

    logger.error(err);

    res.status(500).json({
        error: "Internal Server Error",
        eventId: res.sentry,
    });
});

export default app;
