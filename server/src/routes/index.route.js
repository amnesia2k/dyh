import { Router } from "express";
import authRoutes from "./user.route.js";
import memberRoutes from "./member.route.js";
import hotRoutes from "./hot.route.js";
// import messageRoutes from "./contact.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/member", memberRoutes);
router.use("/hot", hotRoutes);
// router.use("/message", messageRoutes);

export default router;
