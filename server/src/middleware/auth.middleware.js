import { verifyToken as verifyJwtToken } from "../utils/generate-token.js";
import Hot from "../db/models/hot.model.js";
import { logger } from "../utils/logger.js";
import { response } from "../utils/response.js";

export async function verifyToken(req, res, next) {
  try {
    // Accept token from cookies or Authorization header (Bearer scheme).
    // Split by spaces so it works even if Swagger/UI prefixes "Bearer " automatically
    // and the user also pastes a value that already includes "Bearer ".
    const tokenFromHeader = req.headers?.authorization?.split?.(" ")?.filter(Boolean)?.pop();
    const token = req.cookies?.token || tokenFromHeader;
    if (!token) {
      return response(res, 401, "Unauthorized: You must be logged in to access this route");
    }

    let decoded;
    try {
      decoded = verifyJwtToken(token);
      logger.info("verifyToken: decoded token:", decoded);
    } catch (err) {
      logger.error("verifyToken: token verification failed", err);
      return response(res, 401, "Invalid or expired token");
    }

    // Load the HOT by decoded._id
    const user = await Hot.findById(decoded._id).select("-passwordHash");
    logger.info("verifyToken: hot lookup result:", user);

    if (!user) {
      return response(res, 401, "User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    logger.error("❌ verifyToken error:", err);
    return response(res, 500, "Internal server error");
  }
}

export function verifyHotToken(req, res, next) {
  if (!req.user) {
    return response(res, 401, "Unauthorized: No user context found");
  }

  if (!["hot", "admin"].includes(req.user.role)) {
    return response(res, 403, "Forbidden: HOT or admin role required");
  }

  next();
}

export function verifyAdminToken(req, res, next) {
  if (!req.user) {
    return response(res, 401, "Unauthorized: No user context found");
  }

  if (req.user.role !== "admin") {
    return response(res, 403, "Forbidden: Admins only");
  }

  next();
}
