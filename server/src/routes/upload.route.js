import { Router } from "express";
import { upload } from "../middleware/upload.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = Router();

/**
 * @openapi
 * /upload/image:
 *   post:
 *     summary: Upload an image to Cloudinary
 *     description: >
 *       Accepts a single image file, uploads it to Cloudinary, and returns the hosted image URL.
 *       Use the returned `imageUrl` in other JSON-based endpoints (e.g. members, events, announcements).
 *     tags:
 *       - Uploads
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload.
 *     responses:
 *       201:
 *         description: Image uploaded successfully.
 *       400:
 *         description: No file provided or validation error.
 *       500:
 *         description: Server error while uploading.
 */
router.post("/image", upload.single("image"), uploadImage);

export default router;
