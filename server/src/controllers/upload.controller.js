import { uploadImageBuffer } from "../utils/cloudinary.js";
import { logger } from "../utils/logger.js";
import { response } from "../utils/response.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return response(res, 400, "No file provided. Expected field name 'image'.");
    }

    const result = await uploadImageBuffer(req.file.buffer);

    return response(res, 201, "Image uploaded successfully", {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    logger.error("Image upload failed:", error);
    return response(res, 500, "Failed to upload image", undefined, {
      error: error.message,
    });
  }
};
