import { Router } from "express";
import {
  createInstagramPost,
  deleteInstagramPost,
  getInstagramPosts,
} from "../controllers/instagram.controller.js";

const router = Router();

/**
 * @openapi
 * /instagram:
 *   post:
 *     summary: Create an Instagram embed entry
 *     description: Accepts an Instagram permalink, generates the embed HTML, and stores it.
 *     tags:
 *       - Instagram
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://www.instagram.com/p/abc123/
 *             required:
 *               - url
 *     responses:
 *       201:
 *         description: Instagram post created successfully.
 *       400:
 *         description: Invalid Instagram URL.
 */
router.post("/", createInstagramPost);

/**
 * @openapi
 * /instagram:
 *   get:
 *     summary: List Instagram posts
 *     description: Returns all stored Instagram posts sorted by creation date (newest first).
 *     tags:
 *       - Instagram
 *     responses:
 *       200:
 *         description: Instagram posts fetched successfully.
 */
router.get("/", getInstagramPosts);

/**
 * @openapi
 * /instagram/{id}:
 *   delete:
 *     summary: Delete an Instagram post
 *     description: Remove an Instagram post by its ID.
 *     tags:
 *       - Instagram
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Instagram post ID.
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *       404:
 *         description: Post not found.
 */
router.delete("/:id", deleteInstagramPost);

export default router;
