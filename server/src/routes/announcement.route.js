import { Router } from "express";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  getAnnouncements,
  updateAnnouncement,
} from "../controllers/announcement.controller.js";
import { validateRequest } from "zod-express-middleware";
import { createAnnouncementSchema, updateAnnouncementSchema } from "../utils/validate-schema.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /announcement:
 *   get:
 *     summary: Get all announcements
 *     description: Returns all announcements, ordered by date (newest first).
 *     tags:
 *       - Announcements
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Full-text search term.
 *     responses:
 *       200:
 *         description: Announcements fetched successfully.
 */
router.get("/", getAnnouncements);

/**
 * @openapi
 * /announcement/{id}:
 *   get:
 *     summary: Get a single announcement
 *     description: Fetch a single announcement by its ID.
 *     tags:
 *       - Announcements
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID.
 *     responses:
 *       200:
 *         description: Announcement fetched successfully.
 *       404:
 *         description: Announcement not found.
 */
router.get("/:id", getAnnouncementById);

/**
 * @openapi
 * /announcement:
 *   post:
 *     summary: Create a new announcement
 *     description: Create a new announcement (protected route).
 *     tags:
 *       - Announcements
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
 *               summary:
 *                 type: string
 *               body:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 description: URL to announcement image.
 *             required:
 *               - title
 *               - date
 *     responses:
 *       201:
 *         description: Announcement created successfully.
 */
router.post(
  "/",
  protectRoute,
  validateRequest({ body: createAnnouncementSchema }),
  createAnnouncement
);

/**
 * @openapi
 * /announcement/{id}:
 *   patch:
 *     summary: Update an announcement
 *     description: Update fields of an existing announcement (protected route).
 *     tags:
 *       - Announcements
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AnnouncementUpdate"
 *     responses:
 *       200:
 *         description: Announcement updated successfully.
 *       404:
 *         description: Announcement not found.
 */
router.patch(
  "/:id",
  protectRoute,
  validateRequest({ body: updateAnnouncementSchema }),
  updateAnnouncement
);

/**
 * @openapi
 * /announcement/{id}:
 *   delete:
 *     summary: Delete an announcement
 *     description: Delete an announcement by ID (protected route).
 *     tags:
 *       - Announcements
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID.
 *     responses:
 *       200:
 *         description: Announcement deleted successfully.
 *       404:
 *         description: Announcement not found.
 */
router.delete("/:id", protectRoute, deleteAnnouncement);

export default router;
