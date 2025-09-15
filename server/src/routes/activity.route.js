import { Router } from "express";
import { getAllActivities } from "../controllers/activity.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, getAllActivities);

export default router;
