import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

export const connectToDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};
