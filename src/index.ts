import "dotenv/config";
import { Sentry } from "./config/sentry";
import app from "./config/app";

const port = Number(process.env.PORT) || 5000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const shutdown = async () => {
  server.close(async () => {
    await Sentry.flush(2000);
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
