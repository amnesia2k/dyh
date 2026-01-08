import { Router } from "express";
import {
  createSermon,
  deleteSermon,
  getSermonById,
  getSermons,
  updateSermon,
} from "../controllers/sermon.controller.js";
import { verifyAdminToken, verifyHotToken, verifyToken } from "../middleware/auth.middleware.js";
import { validateCreateSermon, validateUpdateSermon } from "../utils/validate-schema.js";

const router = Router();

/**
 * @openapi
 * /sermon:
 *   get:
 *     summary: Get all sermons
 *     description: Returns all sermons, optionally filtered by a search term (requires authenticated role: past-hot, hot, or admin).
 *     tags:
 *       - Sermons
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search term.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sermons fetched successfully.
 */
router.use(verifyToken);

router.get("/", getSermons);

/**
 * @openapi
 * /sermon/{id}:
 *   get:
 *     summary: Get a single sermon
 *     description: Fetch a single sermon by its ID (requires authenticated role: past-hot, hot, or admin).
 *     tags:
 *       - Sermons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sermon ID.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sermon fetched successfully.
 *       404:
 *         description: Sermon not found.
 */
router.get("/:id", getSermonById);

router.use(verifyHotToken);

/**
 * @openapi
 * /sermon:
 *   post:
 *     summary: Create a new sermon
 *     description: Create a new sermon entry (HOT or admin).
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
router.post("/", validateCreateSermon, createSermon);

/**
 * @openapi
 * /sermon/{id}:
 *   patch:
 *     summary: Update a sermon
 *     description: Update fields of an existing sermon (HOT or admin).
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
router.patch("/:id", validateUpdateSermon, updateSermon);

router.use(verifyAdminToken);

/**
 * @openapi
 * /sermon/{id}:
 *   delete:
 *     summary: Delete a sermon
 *     description: Delete a sermon by ID (admin only).
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
router.delete("/:id", deleteSermon);

export default router;
