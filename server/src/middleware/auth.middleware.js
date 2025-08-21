import { verifyToken } from "../utils/generate-token.js";
import User from "../db/models/user.model.js";

/**
 * protectRoute - parses cookie token and populates req.user
 * requires cookie-parser middleware in Express app
 */
export async function protectRoute(req, res, next) {
  try {
    const token =
      req.cookies?.token || req.headers?.authorization?.split?.("Bearer ")?.[1];
    if (!token) {
      return res
        .status(401)
        .json({
          message: "Unauthorized: You must be logged in to access this route",
          success: false,
        });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token", success: false });
    }

    // find user, exclude passwordHash
    const user = await User.findById(decoded._id).select("-passwordHash");
    if (!user)
      return res
        .status(401)
        .json({ message: "User not found", success: false });

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ protectRoute error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
}
