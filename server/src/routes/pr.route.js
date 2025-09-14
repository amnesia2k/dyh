import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { createPrSchema, updatePrSchema } from "../utils/validate-schema.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPR, getAllPRs, getSinglePR, updatePRStatus } from "../controllers/pr.controller.js";

const router = Router();

// create prayer request
router.post("/", validateRequest({ body: createPrSchema }), createPR);

// get all prayer requests
router.get("/", getAllPRs);

// get single prayer request
router.get("/:id", getSinglePR);

// update prayer request
router.patch("/:id", protectRoute, validateRequest({ body: updatePrSchema }), updatePRStatus);

export default router;
