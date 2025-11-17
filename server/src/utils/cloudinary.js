import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";
import { logger } from "./logger.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadImageBuffer = async (buffer, options = {}) => {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary environment variables are not configured");
  }

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: env.CLOUDINARY_FOLDER || "dyh",
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) {
          logger.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    upload.end(buffer);
  });
};

export const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error("Cloudinary delete error:", error);
  }
};
