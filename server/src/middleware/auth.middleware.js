// middleware/auth.middleware.js
import { verifyToken } from "../utils/generate-token.js";
import Hot from "../db/models/hot.model.js";

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
      console.log("protectRoute: decoded token:", decoded);
    } catch (err) {
      console.error("protectRoute: token verification failed", err);
      return res
        .status(401)
        .json({ message: "Invalid or expired token", success: false });
    }

    // Load the HOT by decoded._id
    const user = await Hot.findById(decoded._id).select("-passwordHash");
    console.log("protectRoute: hot lookup result:", user);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ protectRoute error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
}
