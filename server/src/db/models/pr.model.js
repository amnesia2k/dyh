import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const PrayerRequestSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },

    fullName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    message: {
      type: String,
      required: true,
    },

    anonymous: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["new", "read", "resolved"],
      default: "new",
    },

    resolvedAt: Date,

    // resolvedBy: { type: String, ref: "User", default: null },

    // ip: String
  },
  { timestamps: true, versionKey: false }
);

PrayerRequestSchema.methods.markResolved = async function (userId) {
  this.status = "resolved";
  this.resolvedAt = new Date();
  if (userId) this.resolvedBy = userId;
  return this.save();
};

PrayerRequestSchema.index({ status: 1, createdAt: -1 });
PrayerRequestSchema.index({ message: "text" });

export const PrayerRequest =
  mongoose.models.PrayerRequest || mongoose.model("PrayerRequest", PrayerRequestSchema);
export default PrayerRequest;
