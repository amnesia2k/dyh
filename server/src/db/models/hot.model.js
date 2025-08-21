import mongoose from "mongoose";
import { createId } from "@paralleldrive/cuid2";

const HotSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => createId(),
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    tribe: {
      type: String,
      required: true,
      trim: true,
    },

    photo: String,

    phone: {
      type: String,
      trim: true,
    },

    email: String,
  },
  { timestamps: true, versionKey: false }
);

HotSchema.index({ fullName: "text", tribe: "text" });

export const HeadOfTribe =
  mongoose.models.HeadOfTribe || mongoose.model("HeadOfTribe", HotSchema);
export default HeadOfTribe;
