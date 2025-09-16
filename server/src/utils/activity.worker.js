import { Worker } from "bullmq";
import ActivityLog from "../db/models/activity.model.js";
import { redisConnection } from "./redis.js";
import { connectToDB } from "../db/mongo.js";
import { logger } from "./logger.js";

connectToDB();

const worker = new Worker(
  "activity-queue",
  async (job) => {
    const { type, action, refId, summary } = job.data;

    await ActivityLog.create({ type, action, refId, summary });

    logger.info("✅ Activity logged:", { type, action, refId, summary });
  },
  { connection: redisConnection }
);

worker.on("active", (job) => {
  logger.info(`⚡ Job started: ${job.id}`);
});

worker.on("failed", (job, err) => {
  logger.error(`❌ Job ${job.id} failed:`, err);
});

worker.on("completed", (job) => {
  logger.info(`✅ Job ${job.id} completed`);
});
