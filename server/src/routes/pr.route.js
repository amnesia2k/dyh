import { Router } from "express";
import { validateCreatePr, validateUpdatePr } from "../utils/validate-schema.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPR, getAllPRs, getSinglePR, updatePRStatus } from "../controllers/pr.controller.js";

const router = Router();

/**
 * @openapi
 * /prayer-request:
 *   post:
 *     summary: Submit a new prayer request
 *     description: Public-facing endpoint to create a new prayer request.
 *     tags:
 *       - Prayer Requests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               message:
 *                 type: string
 *               anonymous:
 *                 type: boolean
 *             required:
 *               - message
 *     responses:
 *       201:
 *         description: Prayer request created successfully.
 *       400:
 *         description: Validation error.
 */
router.post("/", validateCreatePr, createPR);

/**
 * @openapi
 * /prayer-request:
 *   get:
 *     summary: Get all prayer requests
 *     description: Returns all prayer requests (typically for admin/HOT dashboards).
 *     tags:
 *       - Prayer Requests
 *     responses:
 *       200:
 *         description: Prayer requests fetched successfully.
 */
router.get("/", getAllPRs);

/**
 * @openapi
 * /prayer-request/{id}:
 *   get:
 *     summary: Get a single prayer request
 *     description: Fetch a single prayer request by its ID.
 *     tags:
 *       - Prayer Requests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prayer request ID.
 *     responses:
 *       200:
 *         description: Prayer request fetched successfully.
 *       404:
 *         description: Prayer request not found.
 */
router.get("/:id", getSinglePR);

/**
 * @openapi
 * /prayer-request/{id}:
 *   patch:
 *     summary: Update a prayer request
 *     description: Update the status or details of a prayer request (protected route).
 *     tags:
 *       - Prayer Requests
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prayer request ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PrayerRequestUpdate"
 *     responses:
 *       200:
 *         description: Prayer request updated successfully.
 *       404:
 *         description: Prayer request not found.
 */
router.patch("/:id", protectRoute, validateUpdatePr, updatePRStatus);

export default router;
