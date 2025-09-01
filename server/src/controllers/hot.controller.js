import Hot from "../db/models/hot.model.js";
import { generateToken } from "../utils/generate-token.js";
import bcrypt from "bcryptjs";
import { logger } from "../utils/logger.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const getHots = async (_req, res) => {
  try {
    const hots = await Hot.find().select("-passwordHash");

    return res.status(200).json({
      message: "HOTs fetched successfully",
      success: true,
      data: { hots },
    });
  } catch (err) {
    logger.error("❌ getHots error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getCurrentHot = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No user found" });
    }
    const user = req.user.toObject();
    delete user.passwordHash;
    return res.status(200).json({
      message: "Current HOT fetched successfully",
      success: true,
      data: { user },
    });
  } catch (err) {
    logger.error("❌ getCurrentHot error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const registerHot = async (req, res) => {
  try {
    const { name, email, password, tribe, bio, photo, phone } = req.body;
    if (!name || !email || !password || !tribe || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and tribe are required.",
      });
    }
    const existing = await Hot.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email address already in use." });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newHot = await Hot.create({
      name,
      email,
      passwordHash: hashed,
      tribe,
      bio,
      photo,
      phone,
    });
    const token = generateToken(newHot._id);
    res.cookie("token", token, COOKIE_OPTIONS);
    const safeUser = newHot.toObject();
    delete safeUser.passwordHash;
    safeUser.token = token;
    return res.status(201).json({
      message: "HOT created successfully",
      success: true,
      data: { user: safeUser },
    });
  } catch (err) {
    logger.error("❌ createHot error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getSingleHot = async (req, res) => {
  try {
    const hot = await Hot.findById(req.params.id);
    if (!hot) {
      return res.status(404).json({ message: "HOT not found", success: false });
    }
    const safe = hot.toObject();
    delete safe.passwordHash;
    res
      .status(200)
      .json({ message: "HOT fetched successfully", success: true, data: safe });
  } catch (err) {
    logger.error("❌ getSingleHot error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateHot = async (req, res) => {
  try {
    const hot = await Hot.findById(req.params.id);

    if (!hot) {
      return res.status(404).json({ message: "HOT not found", success: false });
    }

    Object.assign(hot, req.body);

    if (req.body.password) {
      hot.passwordHash = await bcrypt.hash(req.body.password, 10);
    }

    await hot.save();

    const updated = hot.toObject();

    delete updated.passwordHash;

    res.status(200).json({
      message: "HOT updated successfully",
      success: true,
      data: updated,
    });
  } catch (err) {
    logger.error("❌ updateHot error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteHot = async (req, res) => {
  try {
    const hot = await Hot.findByIdAndDelete(req.params.id);

    if (!hot) {
      return res.status(404).json({ message: "HOT not found", success: false });
    }

    res
      .status(200)
      .json({ message: "HOT deleted successfully", success: true });
  } catch (err) {
    logger.error("❌ deleteHot error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const loginHot = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });

    const hot = await Hot.findOne({ email }).select("+passwordHash");
    if (!hot)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });

    const isMatch = await hot.comparePassword(password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });

    hot.lastLogin = new Date();
    await hot.save();

    const token = generateToken(hot._id);
    res.cookie("token", token, COOKIE_OPTIONS);
    const safeUser = hot.toObject();
    delete safeUser.passwordHash;
    safeUser.token = token;
    return res.status(200).json({
      message: "Login successful",
      success: true,
      data: { user: safeUser },
    });
  } catch (err) {
    logger.error("❌ loginHot error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
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
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (err) {
    logger.error("❌ logoutHot error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
