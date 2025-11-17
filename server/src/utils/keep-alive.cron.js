import https from "https";
import { CronJob } from "cron";
import { logger } from "./logger.js";
import { env } from "./env.js";

// Cron expression: "*/14 * * * *" → every 14 minutes.
// This job is only started in production (see startKeepAliveJob below).
const keepAliveJob = new CronJob("*/14 * * * *", () => {
  if (!env.API_URL) {
    logger.warn("Keep-alive cron: API_URL is not set, skipping request");
    return;
  }

  https
    .get(env.API_URL, (res) => {
      if (res.statusCode === 200) {
        logger.info("Keep-alive cron: GET request sent successfully");
      } else {
        logger.warn("Keep-alive cron: GET request failed", res.statusCode);
      }
    })
    .on("error", (error) => {
      logger.error("Keep-alive cron: Error while sending request", error);
    });
});

export function startKeepAliveJob() {
  if (env.NODE_ENV === "production") {
    keepAliveJob.start();
    logger.info("Keep-alive cron job started (every 14 minutes)");
  } else {
    logger.info("Keep-alive cron job not started (NODE_ENV is not production)");
  }
}
