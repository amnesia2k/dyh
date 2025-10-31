import mongoose from "mongoose";
import { createId } from "@paralleldrive/cuid2";

const MemberSchema = new mongoose.Schema(
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

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    birthday: Date,

    address: String,

    departmentOfInterest: String,

    joinedAt: {
      type: Date,
      default: () => new Date(),
    },

    // tags: [String],

    photo: String,

    // createdBy: {
    //   type: String, ref: "User"
    // }
  },
  { timestamps: true, versionKey: false }
);

MemberSchema.index({ fullName: "text", email: "text", phone: "text" });

export const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);
export default Member;
