"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sentry_1 = require("./sentry");
const cors_2 = require("./cors");
const app = (0, express_1.default)();
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use(express_1.default.json());
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
    res.status(500).json({
        error: "Internal Server Error",
        eventId: res.sentry,
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map