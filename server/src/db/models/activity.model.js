import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const ActivityLogSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
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

    type: {
      type: String,
      enum: ["NEW", "UPDATED", "DELETED"], // or whatever categories you need
      required: true,
    },

    message: {
      type: String,
    },

    meta: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true, versionKey: false }
);

ActivityLogSchema.index({ createdAt: -1 });

export const ActivityLog =
  mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);

export default ActivityLog;
