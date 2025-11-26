import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const SermonSchema = new Schema(
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
      default: () => new Date(),
      required: true,
    },

    spotifyEmbedUrl: String,

    description: String,

    speaker: String,

    // tags: [String],

    // createdBy: { type: String, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

SermonSchema.index({ title: "text", description: "text" });
SermonSchema.index({ date: -1 });

export const Sermon = mongoose.models.Sermon || mongoose.model("Sermon", SermonSchema);
export default Sermon;
