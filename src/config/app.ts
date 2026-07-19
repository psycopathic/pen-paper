import express from "express";
import cors from "cors";
import { Sentry } from "./sentry";
import { corsOptions } from "./cors";



const app = express();


app.use(cors(corsOptions));
app.use(express.json());

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
    res.status(500).json({
        error: "Internal Server Error",
        eventId: res.sentry,
    });
});

export default app;
