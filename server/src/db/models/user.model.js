import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { createId } from "@paralleldrive/cuid2";

/**
 * NOTE: passwordHash is set select: false so it is hidden by default.
 * Use .select("+passwordHash") when you need to compare during login.
 */

const UserSchema = new mongoose.Schema(
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

    // store hashed password here; hidden by default
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    name: {
      type: String,
      trim: true,
    },

    // optional biography
    bio: {
      type: String,
      default: "This user has no bio",
    },

    role: {
      type: String,
      enum: ["admin", "hot"],
      default: "hot",
    },

    lastLogin: Date,

    avatar: String,
  },
  { timestamps: true }
);

// instance method to compare password
UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

// Optional: convenience method to set hashed password
UserSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 10);
  return this.passwordHash;
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
