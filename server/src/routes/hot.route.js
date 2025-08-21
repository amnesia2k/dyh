import { Router } from "express";
import {
  createHot,
  deleteHot,
  getAllHots,
  getSingleHot,
  updateHot,
} from "../controllers/hot.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createHotSchema, updateHotSchema } from "../utils/validate-schema.js";
import { validateRequest } from "zod-express-middleware";

const router = Router();

router.get("/", getAllHots);
router.get("/:id", getSingleHot);

router.post(
  "/",
  protectRoute,
  validateRequest({ body: createHotSchema }),
  createHot
);

router.patch(
  "/:id",
  protectRoute,
  validateRequest({ body: updateHotSchema }),
  updateHot
);

router.delete("/:id", protectRoute, deleteHot);

export default router;
