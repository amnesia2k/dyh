import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const InstagramPostSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    url: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => value.startsWith("https://www.instagram.com/"),
        message: "URL must start with https://www.instagram.com/",
      },
    },
    embedHtml: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

InstagramPostSchema.pre("save", function updateTimestamp(next) {
  this.updatedAt = Date.now();
  next();
});

export const InstagramPost =
  mongoose.models.InstagramPost || mongoose.model("InstagramPost", InstagramPostSchema);

export default InstagramPost;
