import app from "./app";
import { logger } from "./lib/logger";
import { runMigrations } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Start serving immediately so health checks pass
app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");

  // Run migrations in background — non-fatal so server stays up even if it fails
  runMigrations(process.env["DATABASE_URL"] ?? "")
    .then(() => { logger.info("DB migrations completed successfully"); })
    .catch((migErr) => { logger.error({ err: migErr }, "DB migration failed (non-fatal)"); });
});
