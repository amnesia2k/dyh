import mongoose from "mongoose";
import { createId } from "@paralleldrive/cuid2";
import bcrypt from "bcryptjs";

const HotSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => createId(),
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    name: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      default: "This user has no bio",
    },

    tribe: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "hot"],
      default: "hot",
    },

    lastLogin: Date,

    photo: String,

    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

HotSchema.index({ name: "text", tribe: "text" });

HotSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

HotSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 10);
  return this.passwordHash;
};

const Hot =
  mongoose.models.HeadOfTribe || mongoose.model("HeadOfTribe", HotSchema);

export default Hot;
