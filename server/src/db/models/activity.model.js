import mongoose from "mongoose";
import { createId } from "@paralleldrive/cuid2";

const ActivityLogSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => createId(),
    },

    // actor: {
    //   type: String,
    //   ref: "User",
    //   default: null,
    // },

    action: {
      type: String,
      required: true,
    },

    meta: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true, versionKey: false }
);

ActivityLogSchema.index({ createdAt: -1 });

export const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", ActivityLogSchema);
export default ActivityLog;
