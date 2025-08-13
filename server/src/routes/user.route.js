import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import {
  getUsers,
  createUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { loginSchema, registerSchema } from "../utils/validate-schema.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", validateRequest({ body: registerSchema }), createUser);
router.post("/login", validateRequest({ body: loginSchema }), loginUser);
router.post("/logout", logoutUser);

// Protected routes
router.get("/me", protectRoute, getCurrentUser);
router.get("/hots", getUsers);

export default router;
