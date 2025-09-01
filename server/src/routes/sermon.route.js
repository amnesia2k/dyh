import { Router } from "express";
import {
  createSermon,
  deleteSermon,
  getSermonById,
  getSermons,
  updateSermon,
} from "../controllers/sermon.controller.js";
import { validateRequest } from "zod-express-middleware";
import {
  createSermonSchema,
  updateSermonSchema,
} from "../utils/validate-schema.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getSermons);
router.get("/:id", getSermonById);

router.post(
  "/",
  protectRoute,
  validateRequest({ body: createSermonSchema }),
  createSermon
);

router.patch(
  "/:id",
  protectRoute,
  validateRequest({ body: updateSermonSchema }),
  updateSermon
);

router.delete("/:id", protectRoute, deleteSermon);

export default router;
