import { Router } from "express";
import {
  createMember,
  deleteMember,
  getAllMembers,
  getSingleMember,
  updateMember,
} from "../controllers/member.controller.js";
import { verifyAdminToken, verifyHotToken, verifyToken } from "../middleware/auth.middleware.js";
import { validateCreateMember, validateUpdateMember } from "../utils/validate-schema.js";

const router = Router();

/**
 * @openapi
 * /member:
 *   get:
 *     summary: Get all members
 *     description: Returns a list of all members, ordered by creation date (newest first). Requires authentication (past-hot, hot, or admin).
 *     tags:
 *       - Members
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Members fetched successfully.
 */
router.use(verifyToken);

router.get("/", getAllMembers);

/**
 * @openapi
 * /member/{id}:
 *   get:
 *     summary: Get a single member
 *     description: Fetch a single member by its ID (requires authenticated role: past-hot, hot, or admin).
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
router.get("/:id", getSingleMember);

router.use(verifyHotToken);

/**
 * @openapi
 * /member:
 *   post:
 *     summary: Create a new member
 *     description: Register a new member in the system (HOT or admin).
 *     tags:
 *       - Members
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
router.post("/", validateCreateMember, createMember);

/**
 * @openapi
 * /member/{id}:
 *   patch:
 *     summary: Update a member
 *     description: Update fields of an existing member (HOT or admin).
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
router.patch("/:id", validateUpdateMember, updateMember);

router.use(verifyAdminToken);

/**
 * @openapi
 * /member/{id}:
 *   delete:
 *     summary: Delete a member
 *     description: Permanently delete a member by its ID (admin only).
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
router.delete("/:id", deleteMember);

export default router;
