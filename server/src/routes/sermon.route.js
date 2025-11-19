import { Router } from "express";
import {
  createSermon,
  deleteSermon,
  getSermonById,
  getSermons,
  updateSermon,
} from "../controllers/sermon.controller.js";
import { validateRequest } from "zod-express-middleware";
import { createSermonSchema, updateSermonSchema } from "../utils/validate-schema.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /sermon:
 *   get:
 *     summary: Get all sermons
 *     description: Returns all sermons, optionally filtered by a search term.
 *     tags:
 *       - Sermons
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search term.
 *     responses:
 *       200:
 *         description: Sermons fetched successfully.
 */
router.get("/", getSermons);

/**
 * @openapi
 * /sermon/{id}:
 *   get:
 *     summary: Get a single sermon
 *     description: Fetch a single sermon by its ID.
 *     tags:
 *       - Sermons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sermon ID.
 *     responses:
 *       200:
 *         description: Sermon fetched successfully.
 *       404:
 *         description: Sermon not found.
 */
router.get("/:id", getSermonById);

/**
 * @openapi
 * /sermon:
 *   post:
 *     summary: Create a new sermon
 *     description: Create a new sermon entry (protected route).
 *     tags:
 *       - Sermons
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               spotifyEmbedUrl:
 *                 type: string
 *               description:
 *                 type: string
 *               speaker:
 *                 type: string
 *             required:
 *               - title
 *               - date
 *     responses:
 *       201:
 *         description: Sermon created successfully.
 *       400:
 *         description: Validation error.
 */
router.post("/", protectRoute, validateRequest({ body: createSermonSchema }), createSermon);

/**
 * @openapi
 * /sermon/{id}:
 *   patch:
 *     summary: Update a sermon
 *     description: Update fields of an existing sermon (protected route).
 *     tags:
 *       - Sermons
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sermon ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SermonUpdate"
 *     responses:
 *       200:
 *         description: Sermon updated successfully.
 *       404:
 *         description: Sermon not found.
 */
router.patch("/:id", protectRoute, validateRequest({ body: updateSermonSchema }), updateSermon);

/**
 * @openapi
 * /sermon/{id}:
 *   delete:
 *     summary: Delete a sermon
 *     description: Delete a sermon by ID (protected route).
 *     tags:
 *       - Sermons
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sermon ID.
 *     responses:
 *       200:
 *         description: Sermon deleted successfully.
 *       404:
 *         description: Sermon not found.
 */
router.delete("/:id", protectRoute, deleteSermon);

export default router;
