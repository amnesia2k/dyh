import { verifyToken } from "../utils/generate-token.js";
import Hot from "../db/models/hot.model.js";
import { logger } from "../utils/logger.js";
import { response } from "../utils/response.js";

export async function protectRoute(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers?.authorization?.split?.("Bearer ")?.[1];
    if (!token) {
      return response(res, 401, "Unauthorized: You must be logged in to access this route");
    }

    let decoded;
    try {
      decoded = verifyToken(token);
      logger.info("protectRoute: decoded token:", decoded);
    } catch (err) {
      logger.error("protectRoute: token verification failed", err);
      return response(res, 401, "Invalid or expired token");
    }

    // Load the HOT by decoded._id
    const user = await Hot.findById(decoded._id).select("-passwordHash");
    logger.info("protectRoute: hot lookup result:", user);

    if (!user) {
      return response(res, 401, "User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    logger.error("❌ protectRoute error:", err);
    return response(res, 500, "Internal server error");
  }
}

export function adminGuard(req, res, next) {
  if (!req.user) {
    return response(res, 401, "Unauthorized: No user context found");
  }

  if (req.user.role !== "admin") {
    return response(res, 403, "Forbidden: Admins only");
  }

  next();
}
