import { uploadImageBuffer } from "../utils/cloudinary.js";
import { logger } from "../utils/logger.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided. Expected field name 'image'.",
      });
    }

    const result = await uploadImageBuffer(req.file.buffer);

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        imageUrl: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error) {
    logger.error("Image upload failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};
