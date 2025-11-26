import Hot from "../db/models/hot.model.js";
import { generateToken } from "../utils/generate-token.js";
import bcrypt from "bcryptjs";
import { logger } from "../utils/logger.js";
import { logActivity } from "../utils/activity.queue.js";
import { response } from "../utils/response.js";

export const getHots = async (_req, res) => {
  try {
    const hots = await Hot.find().select("-passwordHash");

    return response(res, 200, "HOTs fetched successfully", hots);
  } catch (err) {
    logger.error("❌ getHots error:", err);
    return response(res, 500, "Internal server error");
  }
};

export const getCurrentHot = async (req, res) => {
  try {
    if (!req.user) {
      return response(res, 401, "Unauthorized: No user found");
    }
    const user = req.user.toObject();
    delete user.passwordHash;
    return response(res, 200, "Current HOT fetched successfully", user);
  } catch (err) {
    logger.error("❌ getCurrentHot error:", err);
    return response(res, 500, "Internal server error");
  }
};

export const registerHot = async (req, res) => {
  try {
    const { name, email, password, tribe, bio, imageUrl, phone } = req.body;
    if (!name || !email || !password || !tribe || !phone) {
      return response(res, 400, "Name, email, password and tribe are required.");
    }
    const existing = await Hot.findOne({ email });
    if (existing) {
      return response(res, 400, "Email address already in use.");
    }
    const hashed = await bcrypt.hash(password, 10);
    const newHot = await Hot.create({
      name,
      email,
      passwordHash: hashed,
      tribe,
      bio,
      imageUrl,
      phone,
    });
    const token = generateToken(newHot._id);
    const safeUser = newHot.toObject();
    delete safeUser.passwordHash;
    safeUser.token = token;

    logActivity("HOT", "NEW", newHot);
    return response(res, 201, "HOT created successfully", safeUser);
  } catch (err) {
    logger.error("❌ createHot error:", err);
    return response(res, 500, "Internal server error");
  }
};

export const getSingleHot = async (req, res) => {
  try {
    const hot = await Hot.findById(req.params.id);
    if (!hot) {
      return response(res, 404, "HOT not found");
    }
    const safe = hot.toObject();
    delete safe.passwordHash;
    return response(res, 200, "HOT fetched successfully", safe);
  } catch (err) {
    logger.error("❌ getSingleHot error:", err);
    return response(res, 500, "Server error");
  }
};

export const updateHot = async (req, res) => {
  try {
    const hot = await Hot.findById(req.params.id);

    if (!hot) {
      return response(res, 404, "HOT not found");
    }

    Object.assign(hot, req.body);

    if (req.body.password) {
      hot.passwordHash = await bcrypt.hash(req.body.password, 10);
    }

    await hot.save();

    const updated = hot.toObject();

    delete updated.passwordHash;

    logActivity("HOT", "UPDATED", updated);

    return response(res, 200, "HOT updated successfully", updated);
  } catch (err) {
    logger.error("❌ updateHot error:", err);
    return response(res, 500, "Server error");
  }
};

export const deleteHot = async (req, res) => {
  try {
    const hot = await Hot.findByIdAndDelete(req.params.id);

    if (!hot) {
      return response(res, 404, "HOT not found");
    }

    logActivity("HOT", "DELETED", hot);

    return response(res, 200, "HOT deleted successfully");
  } catch (err) {
    logger.error("❌ deleteHot error:", err);
    return response(res, 500, "Server error");
  }
};

export const loginHot = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return response(res, 400, "Email and password are required.");
    }

    const hot = await Hot.findOne({ email }).select("+passwordHash");
    if (!hot) {
      return response(res, 401, "Invalid email or password.");
    }

    const isMatch = await hot.comparePassword(password);
    if (!isMatch) {
      return response(res, 401, "Invalid email or password.");
    }

    hot.lastLogin = new Date();
    await hot.save();

    const token = generateToken(hot._id);
    const safeUser = hot.toObject();
    delete safeUser.passwordHash;
    safeUser.token = token;
    return response(res, 200, "Login successful", safeUser);
  } catch (err) {
    logger.error("❌ loginHot error:", err);
    return response(res, 500, "Internal server error");
  }
};

export const logoutHot = async (_req, res) => {
  try {
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return response(res, 200, "Logout successful");
  } catch (err) {
    logger.error("❌ logoutHot error:", err);
    return response(res, 500, "Internal server error");
  }
};
