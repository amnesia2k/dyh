import { verifyToken } from "../utils/generate-token.js";
import Hot from "../db/models/hot.model.js";
import { logger } from "../utils/logger.js";

export async function protectRoute(req, res, next) {
  try {
    const token =
      req.cookies?.token || req.headers?.authorization?.split?.("Bearer ")?.[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: You must be logged in to access this route",
        success: false,
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
      logger.info("protectRoute: decoded token:", decoded);
    } catch (err) {
      logger.error("protectRoute: token verification failed", err);
      return res
        .status(401)
        .json({ message: "Invalid or expired token", success: false });
    }

    // Load the HOT by decoded._id
    const user = await Hot.findById(decoded._id).select("-passwordHash");
    logger.info("protectRoute: hot lookup result:", user);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    req.user = user;
    next();
  } catch (err) {
    logger.error("❌ protectRoute error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
}
