import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

export const activityQueue = new Queue("activity-queue", {
  connection: redisConnection,
});

// enforce frontend-like shape
export async function logActivity({ type, action, refId, summary }) {
  await activityQueue.add("log", { type, action, refId, summary });
}
