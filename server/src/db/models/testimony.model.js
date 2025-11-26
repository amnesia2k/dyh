import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const TestimonySchema = new Schema(
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

    featured: {
      type: Boolean,
      default: false,
    },

    approved: {
      type: Boolean,
      default: false,
    },

    approvedAt: Date,

    // approvedBy: { type: String, ref: "User", default: null }
  },
  { timestamps: true, versionKey: false }
);

TestimonySchema.methods.toggleFeatured = async function () {
  this.featured = !this.featured;
  return this.save();
};

TestimonySchema.index({ approved: 1, featured: -1, createdAt: -1 });
TestimonySchema.index({ message: "text" });

export const Testimony = mongoose.models.Testimony || mongoose.model("Testimony", TestimonySchema);
export default Testimony;
