import { Router } from "express";
import memberRoutes from "./member.route.js";
import hotRoutes from "./hot.route.js";
import sermonRoute from "./sermon.route.js";
import prayerRequest from "./pr.route.js";
import testimonyRoute from "./testimony.route.js";
import activityRoute from "./activity.route.js";
import eventRoute from "./event.route.js";
import announcementRoute from "./announcement.route.js";

// import messageRoutes from "./contact.route.js";

const router = Router();

router.use("/member", memberRoutes);
router.use("/hot", hotRoutes);
router.use("/sermon", sermonRoute);
router.use("/prayer-request", prayerRequest);
router.use("/testimony", testimonyRoute);
router.use("/activity", activityRoute);
router.use("/event", eventRoute);
router.use("/announcement", announcementRoute);

// router.use("/message", messageRoutes);

export default router;
