import { Router } from "express";
import { getAllActivities } from "../controllers/activity.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /activity:
 *   get:
 *     summary: Get recent activities
 *     description: Returns the activity log, ordered by creation date (newest first). Requires authentication (past-hot, hot, or admin) and is useful for recent activity feeds in the frontend.
 *     tags:
 *       - Activity
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activities fetched successfully.
 */
router.use(verifyToken);

router.get("/", getAllActivities);

export default router;
