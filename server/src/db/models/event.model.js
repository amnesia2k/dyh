import mongoose from "mongoose";
import { createId } from "@paralleldrive/cuid2";

const EventSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => createId(),
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    location: String,

    description: String,

    featured: {
      type: Boolean,
      default: false,
    },

    // createdBy: {
    //   type: String, ref: "User" }
  },
  { timestamps: true, versionKey: false }
);

EventSchema.index({ date: 1 });
EventSchema.index({ title: "text", description: "text" });

export const Event =
  mongoose.models.Event || mongoose.model("Event", EventSchema);
export default Event;
