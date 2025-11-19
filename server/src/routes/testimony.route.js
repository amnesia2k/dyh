import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import {
  createTestimony,
  deleteTestimony,
  getTestimonies,
  getTestimonyById,
  updateTestimony,
} from "../controllers/testimony.controller.js";
import { createTestimonySchema, updateTestimonySchema } from "../utils/validate-schema.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /testimony:
 *   get:
 *     summary: Get all testimonies
 *     description: Returns all testimonies, ordered by creation date (newest first).
 *     tags:
 *       - Testimonies
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
 *     description: Fetch a single testimony by its ID.
 *     tags:
 *       - Testimonies
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
router.post("/", validateRequest({ body: createTestimonySchema }), createTestimony);

/**
 * @openapi
 * /testimony/{id}:
 *   patch:
 *     summary: Update a testimony
 *     description: Update the status, approval, or featured flag of a testimony (protected route).
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
router.patch(
  "/:id",
  protectRoute,
  validateRequest({ body: updateTestimonySchema }),
  updateTestimony
);

/**
 * @openapi
 * /testimony/{id}:
 *   delete:
 *     summary: Delete a testimony
 *     description: Delete a testimony by ID (protected route).
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
router.delete("/:id", protectRoute, deleteTestimony);

export default router;
