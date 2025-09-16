import mongoose from "mongoose";
import { createId } from "@paralleldrive/cuid2";

const ActivityLogSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => createId(),
    },

    type: {
      type: String,
      enum: ["member", "prayer", "testimony", "sermon", "announcement", "hot", "event"],
      required: true,
    },

    action: {
      type: String,
      enum: ["created", "updated", "deleted", "status"],
      required: true,
    },

    refId: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

ActivityLogSchema.index({ createdAt: -1 });

export const ActivityLog =
  mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);

export default ActivityLog;
