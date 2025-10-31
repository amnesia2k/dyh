import User from "../db/models/user.model.js";
import { generateToken } from "../utils/generate-token.js";
import bcrypt from "bcryptjs";
import { logger } from "../utils/logger.js";

/**
 * NOTE: this controller uses passwordHash consistently.
 * Cookies are set secure only in production by default.
 */

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const getUsers = async (_req, res) => {
  try {
    // exclude passwordHash explicitly
    const users = await User.find().select("-passwordHash");

    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      data: { users },
    });
  } catch (err) {
    logger.error("❌ getUsers error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user found" });
    }

    const user = req.user.toObject();

    // ensure sensitive fields are not leaked
    delete user.passwordHash;
    return res.status(200).json({
      message: "Current user fetched successfully",
      success: true,
      data: { user },
    });
  } catch (err) {
    logger.error("❌ getCurrentUser error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ success: false, message: "Email address already in use." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      passwordHash: hashed,
      bio: bio || undefined,
    });

    const token = generateToken(newUser._id);

    res.cookie("token", token, COOKIE_OPTIONS);

    const safeUser = newUser.toObject();
    delete safeUser.passwordHash;
    safeUser.token = token;

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      data: { user: safeUser },
    });
  } catch (err) {
    logger.error("❌ createUser error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required." });

    // include passwordHash for comparison
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    // Update lastLogin (optional)
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.cookie("token", token, COOKIE_OPTIONS);

    const safeUser = user.toObject();
    delete safeUser.passwordHash;
    safeUser.token = token;

    return res.status(200).json({
      message: "Login successful",
      success: true,
      data: { user: safeUser },
    });
  } catch (err) {
    logger.error("❌ loginUser error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logoutUser = async (_req, res) => {
  try {
    // clear cookie (must match options like path/sameSite/secure)
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    logger.error("❌ logoutUser error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
