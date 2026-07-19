"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const sentry_1 = require("./config/sentry");
const app_1 = __importDefault(require("./config/app"));
const port = Number(process.env.PORT) || 5000;
const server = app_1.default.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const shutdown = async () => {
    server.close(async () => {
        await sentry_1.Sentry.flush(2000);
        process.exit(0);
    });
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
//# sourceMappingURL=index.js.map