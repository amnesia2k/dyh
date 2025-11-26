import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const AnnouncementSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
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

    imageUrl: String,

    // pinned: { type: Boolean, default: false },

    // createdBy: { type: String, ref: "User" }
  },
  { timestamps: true, versionKey: false }
);

AnnouncementSchema.index({ title: "text", summary: "text", body: "text" });
AnnouncementSchema.index({ pinned: -1, date: -1 });

export const Announcement =
  mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);
export default Announcement;
