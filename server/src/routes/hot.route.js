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

router.get("/me", protectRoute, getCurrentHot);
router.get("/", getHots);
router.get("/:id", getSingleHot);

router.post("/register", validateRequest({ body: registerSchema }), registerHot);
router.post("/login", validateRequest({ body: loginSchema }), loginHot);
router.post("/logout", protectRoute, logoutHot);

router.patch("/:id", protectRoute, validateRequest({ body: updateSchema }), updateHot);

router.delete("/:id", protectRoute, adminGuard, deleteHot);

export default router;
