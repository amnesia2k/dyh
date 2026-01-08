import { Router } from "express";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  getAnnouncements,
  updateAnnouncement,
} from "../controllers/announcement.controller.js";
import { verifyAdminToken, verifyHotToken, verifyToken } from "../middleware/auth.middleware.js";
import {
  validateCreateAnnouncement,
  validateUpdateAnnouncement,
} from "../utils/validate-schema.js";

const router = Router();

/**
 * @openapi
 * /announcement:
 *   get:
 *     summary: Get all announcements
 *     description: Returns all announcements, ordered by date (newest first). Requires authentication (past-hot, hot, or admin).
 *     tags:
 *       - Announcements
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
 *         description: Announcements fetched successfully.
 */
router.use(verifyToken);

router.get("/", getAnnouncements);

/**
 * @openapi
 * /announcement/{id}:
 *   get:
 *     summary: Get a single announcement
 *     description: Fetch a single announcement by its ID (requires authenticated role: past-hot, hot, or admin).
 *     tags:
 *       - Announcements
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Announcement fetched successfully.
 *       404:
 *         description: Announcement not found.
 */
router.get("/:id", getAnnouncementById);

router.use(verifyHotToken);

/**
 * @openapi
 * /announcement:
 *   post:
 *     summary: Create a new announcement
 *     description: Create a new announcement (HOT or admin).
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
router.post("/", validateCreateAnnouncement, createAnnouncement);

/**
 * @openapi
 * /announcement/{id}:
 *   patch:
 *     summary: Update an announcement
 *     description: Update fields of an existing announcement (HOT or admin).
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
router.patch("/:id", validateUpdateAnnouncement, updateAnnouncement);

router.use(verifyAdminToken);

/**
 * @openapi
 * /announcement/{id}:
 *   delete:
 *     summary: Delete an announcement
 *     description: Delete an announcement by ID (admin only).
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
router.delete("/:id", deleteAnnouncement);

export default router;
