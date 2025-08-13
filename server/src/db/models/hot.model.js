import mongoose from "mongoose";
import { createId } from "@paralleldrive/cuid2";

const HotSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => createId(),
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    tribe: {
      type: String,
      required: true,
      trim: true,
    },

    bio: String,

    photo: String,

    contact: String,

    // createdBy: { type: String, ref: "User" },
  },
  { timestamps: true }
);

HotSchema.index({ name: "text", department: "text" });

export const HeadOfTribe =
  mongoose.models.HeadOfTribe || mongoose.model("HeadOfTribe", HotSchema);
export default HeadOfTribe;
