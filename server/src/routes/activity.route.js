import { Router } from "express";
import { getAllActivities } from "../controllers/activity.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /activity:
 *   get:
 *     summary: Get recent activities
 *     description: Returns the activity log, ordered by creation date (newest first). Useful for recent activity feeds in the frontend.
 *     tags:
 *       - Activity
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activities fetched successfully.
 */
router.get("/", protectRoute, getAllActivities);

export default router;
