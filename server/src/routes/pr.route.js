import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { createPrSchema, updatePrSchema } from "../utils/validate-schema.js";
import { createPR, getAllPRs, updatePRStatus } from "../controllers/pr.controller.js";

const router = Router();

// create prayer request
router.post("/", validateRequest({ body: createPrSchema }), createPR);

// get all prayer requests
router.get("/", getAllPRs);

// update prayer request
router.patch("/:id", validateRequest({ body: updatePrSchema }), updatePRStatus);

export default router;
