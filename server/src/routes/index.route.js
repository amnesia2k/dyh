import { Router } from "express";
import memberRoutes from "./member.route.js";
import hotRoutes from "./hot.route.js";
import sermonRoute from "./sermon.route.js";
import prayerRequest from "./pr.route.js";
// import messageRoutes from "./contact.route.js";

const router = Router();

router.use("/member", memberRoutes);
router.use("/hot", hotRoutes);
router.use("/sermon", sermonRoute);
router.use("/prayer-request", prayerRequest);
// router.use("/message", messageRoutes);

export default router;
