import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { createTestimony } from "../controllers/testimony.controller.js";
import { createTestimonySchema } from "../utils/validate-schema.js";

const router = Router();

// create a testimony
router.post("/", validateRequest({ body: createTestimonySchema }), createTestimony);

export default router;
