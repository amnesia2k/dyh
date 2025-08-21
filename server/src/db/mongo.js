import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

const DB_URL = process.env.DB_URL;

export const connectToDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    logger.info("✅ Connected to MongoDB");
  } catch (err) {
    logger.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};
