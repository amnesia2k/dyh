import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const EventSchema = new Schema(
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

    location: String,

    description: String,

    imageUrl: String,

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

export const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
export default Event;
