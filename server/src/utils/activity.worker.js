import { Worker } from "bullmq";
import ActivityLog from "../db/models/activity.model.js";
import { redisConnection } from "./redis.js";
import { connectToDB } from "../db/mongo.js";

connectToDB();

const worker = new Worker(
  "activity-queue",
  async (job) => {
    const { action, type, meta } = job.data;
    await ActivityLog.create({ action, type, meta });

    console.log({ action, type, meta });
  },
  { connection: redisConnection }
);

worker.on("active", (job) => {
  console.log(`⚡ Job started: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
});

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});
