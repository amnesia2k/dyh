import mongoose from "mongoose";
import { createId } from "@paralleldrive/cuid2";

const AnnouncementSchema = new mongoose.Schema(
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

    summary: String,

    body: String,

    // image: String,

    // pinned: { type: Boolean, default: false },

    // createdBy: { type: String, ref: "User" }
  },
  { timestamps: true }
);

AnnouncementSchema.index({ title: "text", summary: "text", body: "text" });
AnnouncementSchema.index({ pinned: -1, date: -1 });

export const Announcement =
  mongoose.models.Announcement ||
  mongoose.model("Announcement", AnnouncementSchema);
export default Announcement;
