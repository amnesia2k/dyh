import { Router } from "express";
import {
  createMember,
  deleteMember,
  getAllMembers,
  getSingleMember,
  updateMember,
} from "../controllers/member.controller.js";
import { validateRequest } from "zod-express-middleware";
import { createMemberSchema, updateMemberSchema } from "../utils/validate-schema.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /member:
 *   get:
 *     summary: Get all members
 *     description: Returns a list of all members, ordered by creation date (newest first).
 *     tags:
 *       - Members
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Members fetched successfully.
 */
router.get("/", protectRoute, getAllMembers);

/**
 * @openapi
 * /member/{id}:
 *   get:
 *     summary: Get a single member
 *     description: Fetch a single member by its ID.
 *     tags:
 *       - Members
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID.
 *     responses:
 *       200:
 *         description: Member fetched successfully.
 *       404:
 *         description: Member not found.
 */
router.get("/:id", protectRoute, getSingleMember);

/**
 * @openapi
 * /member:
 *   post:
 *     summary: Create a new member
 *     description: Register a new member in the system.
 *     tags:
 *       - Members
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
 *               phone:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *               departmentOfInterest:
 *                 type: string
 *               joinedAt:
 *                 type: string
 *                 format: date
 *               imageUrl:
 *                 type: string
 *                 description: URL to member image.
 *             required:
 *               - fullName
 *     responses:
 *       201:
 *         description: Member created successfully.
 *       400:
 *         description: Validation error.
 */
router.post("/", validateRequest({ body: createMemberSchema }), createMember);

/**
 * @openapi
 * /member/{id}:
 *   patch:
 *     summary: Update a member
 *     description: Update fields of an existing member.
 *     tags:
 *       - Members
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MemberUpdate"
 *     responses:
 *       200:
 *         description: Member updated successfully.
 *       404:
 *         description: Member not found.
 */
router.patch("/:id", validateRequest({ body: updateMemberSchema }), updateMember);

/**
 * @openapi
 * /member/{id}:
 *   delete:
 *     summary: Delete a member
 *     description: Permanently delete a member by its ID.
 *     tags:
 *       - Members
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID.
 *     responses:
 *       200:
 *         description: Member deleted successfully.
 *       404:
 *         description: Member not found.
 */
router.delete("/:id", protectRoute, deleteMember);

export default router;
