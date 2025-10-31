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

router.get("/", protectRoute, getAllMembers);
router.get("/:id", protectRoute, getSingleMember);

router.post("/", validateRequest({ body: createMemberSchema }), createMember);

router.patch("/:id", validateRequest({ body: updateMemberSchema }), updateMember);

router.delete("/:id", protectRoute, deleteMember);

export default router;
