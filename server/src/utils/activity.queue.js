import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

export const activityQueue = new Queue("activity-queue", {
  connection: redisConnection,
});

export async function logActivity(action, type, meta = {}) {
  await activityQueue.add("log", { action, type, meta });
}
