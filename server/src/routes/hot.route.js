import { Router } from "express";
import {
  deleteHot,
  getCurrentHot,
  getHots,
  getSingleHot,
  loginHot,
  logoutHot,
  registerHot,
  updateHot,
} from "../controllers/hot.controller.js";
import { adminGuard, protectRoute } from "../middleware/auth.middleware.js";
import { loginSchema, registerSchema, updateSchema } from "../utils/validate-schema.js";
import { validateRequest } from "zod-express-middleware";

const router = Router();

/**
 * @openapi
 * /hot/me:
 *   get:
 *     summary: Get current HOT profile
 *     description: Returns the currently authenticated HOT user (based on cookie token).
 *     tags:
 *       - HOT
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current HOT fetched successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get("/me", protectRoute, getCurrentHot);

/**
 * @openapi
 * /hot:
 *   get:
 *     summary: Get all HOTs
 *     description: Returns a list of all HOT users.
 *     tags:
 *       - HOT
 *     responses:
 *       200:
 *         description: HOTs fetched successfully.
 */
router.get("/", getHots);

/**
 * @openapi
 * /hot/{id}:
 *   get:
 *     summary: Get a single HOT
 *     description: Fetch a single HOT profile by ID.
 *     tags:
 *       - HOT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: HOT ID.
 *     responses:
 *       200:
 *         description: HOT fetched successfully.
 *       404:
 *         description: HOT not found.
 */
router.get("/:id", getSingleHot);

/**
 * @openapi
 * /hot/register:
 *   post:
 *     summary: Register a new HOT
 *     description: Create a new HOT account.
 *     tags:
 *       - HOT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               tribe:
 *                 type: string
 *               bio:
 *                 type: string
 *               photo:
 *                 type: string
 *               phone:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *               - tribe
 *     responses:
 *       201:
 *         description: HOT created successfully.
 *       400:
 *         description: Validation or conflict error.
 */
router.post("/register", validateRequest({ body: registerSchema }), registerHot);

/**
 * @openapi
 * /hot/login:
 *   post:
 *     summary: Login as HOT
 *     description: Authenticate a HOT user using email and password.
 *     tags:
 *       - HOT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid credentials.
 */
router.post("/login", validateRequest({ body: loginSchema }), loginHot);

/**
 * @openapi
 * /hot/logout:
 *   post:
 *     summary: Logout current HOT
 *     description: Clears the authentication cookie for the current HOT.
 *     tags:
 *       - HOT
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful.
 */
router.post("/logout", protectRoute, logoutHot);

/**
 * @openapi
 * /hot/{id}:
 *   patch:
 *     summary: Update a HOT
 *     description: Update HOT profile details (protected route).
 *     tags:
 *       - HOT
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: HOT ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/HotUpdate"
 *     responses:
 *       200:
 *         description: HOT updated successfully.
 *       404:
 *         description: HOT not found.
 */
router.patch("/:id", protectRoute, validateRequest({ body: updateSchema }), updateHot);

/**
 * @openapi
 * /hot/{id}:
 *   delete:
 *     summary: Delete a HOT
 *     description: Delete a HOT by ID (admin-only, protected route).
 *     tags:
 *       - HOT
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: HOT ID.
 *     responses:
 *       200:
 *         description: HOT deleted successfully.
 *       403:
 *         description: Forbidden (not admin).
 *       404:
 *         description: HOT not found.
 */
router.delete("/:id", protectRoute, adminGuard, deleteHot);

export default router;
