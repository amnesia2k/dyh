import { Router } from "express";
import {
  createTestimony,
  deleteTestimony,
  getTestimonies,
  getTestimonyById,
  updateTestimony,
} from "../controllers/testimony.controller.js";
import { verifyAdminToken, verifyHotToken, verifyToken } from "../middleware/auth.middleware.js";
import { validateCreateTestimony, validateUpdateTestimony } from "../utils/validate-schema.js";

const router = Router();

/**
 * @openapi
 * /testimony:
 *   post:
 *     summary: Submit a testimony
 *     description: Public endpoint to submit a testimony, which may later be approved/featured.
 *     tags:
 *       - Testimonies
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
 *               - fullName
 *               - email
 *               - message
 *     responses:
 *       201:
 *         description: Testimony created successfully.
 *       400:
 *         description: Validation error.
 */
router.post("/", validateCreateTestimony, createTestimony);

router.use(verifyToken);

/**
 * @openapi
 * /testimony:
 *   get:
 *     summary: Get all testimonies
 *     description: Returns all testimonies, ordered by creation date (newest first). Requires authentication (past-hot, hot, or admin).
 *     tags:
 *       - Testimonies
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Testimonies fetched successfully.
 */
router.get("/", getTestimonies);

/**
 * @openapi
 * /testimony/{id}:
 *   get:
 *     summary: Get a single testimony
 *     description: Fetch a single testimony by its ID (requires authenticated role: past-hot, hot, or admin).
 *     tags:
 *       - Testimonies
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimony ID.
 *     responses:
 *       200:
 *         description: Testimony fetched successfully.
 *       404:
 *         description: Testimony not found.
 */
router.get("/:id", getTestimonyById);

router.use(verifyHotToken);

/**
 * @openapi
 * /testimony/{id}:
 *   patch:
 *     summary: Update a testimony
 *     description: Update the status, approval, or featured flag of a testimony (HOT or admin).
 *     tags:
 *       - Testimonies
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimony ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TestimonyUpdate"
 *     responses:
 *       200:
 *         description: Testimony updated successfully.
 *       404:
 *         description: Testimony not found.
 */
router.patch("/:id", validateUpdateTestimony, updateTestimony);

router.use(verifyAdminToken);

/**
 * @openapi
 * /testimony/{id}:
 *   delete:
 *     summary: Delete a testimony
 *     description: Delete a testimony by ID (admin only).
 *     tags:
 *       - Testimonies
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Testimony ID.
 *     responses:
 *       200:
 *         description: Testimony deleted successfully.
 *       404:
 *         description: Testimony not found.
 */
router.delete("/:id", deleteTestimony);

export default router;
