import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const MemberSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
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

    imageUrl: String,

    // createdBy: {
    //   type: String, ref: "User"
    // }
  },
  { timestamps: true, versionKey: false }
);

MemberSchema.index({ fullName: "text", email: "text", phone: "text" });

export const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);
export default Member;
