import { Router } from "express";
import { response } from "../utils/response.js";

const router = Router();

router.get("/", (_req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

  return response(res, 200, "🧠 Decross Youth Hub backend is alive!", {
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

export default router;
