import { Testimony } from "../db/models/testimony.model.js";
import { logger } from "../utils/logger.js";
import { logActivity } from "../utils/activity.queue.js";

export const createTestimony = async (req, res) => {
  try {
    const { fullName, email, message, anonymous, status } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const testimony = await Testimony.create({
      fullName,
      email,
      message,
      anonymous,
      status,
    });

    await logActivity("TESTIMONY", "NEW", testimony);

    return res.status(201).json({
      message: "Testimony created successfully",
      success: true,
      data: testimony,
    });
  } catch (error) {
    logger.error("Failed to create Testimony:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Testimony",
      error: error.message,
    });
  }
};

export const getTestimonies = async (_req, res) => {
  try {
    const testimonies = await Testimony.find().sort({ createdAt: -1 });
    const count = await Testimony.countDocuments();

    logger.info(`Total Testimonies: ${count}`);

    return res.status(200).json({
      message: "Testimonies fetched successfully",
      success: true,
      count,
      data: testimonies,
    });
  } catch (error) {
    logger.error("Failed to get Testimonies:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get Testimonies",
      error: error.message,
    });
  }
};

export const getTestimonyById = async (req, res) => {
  try {
    const testimony = await Testimony.findById(req.params.id);

    if (!testimony) {
      return res.status(404).json({
        message: "Testimony not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Testimony fetched successfully",
      success: true,
      data: testimony,
    });
  } catch (error) {
    logger.error("Failed to get Testimony:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get Testimony",
      error: error.message,
    });
  }
};

export const updateTestimony = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };

    if (update.approved === true && !update.approvedAt) {
      update.approvedAt = new Date();
    }

    const testimony = await Testimony.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!testimony) {
      return res.status(404).json({
        message: "Testimony not found",
        success: false,
      });
    }

    await logActivity("TESTIMONY", "UPDATED", testimony);

    return res.status(200).json({
      message: "Testimony updated successfully",
      success: true,
      data: testimony,
    });
  } catch (error) {
    logger.error("Failed to update Testimony:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update Testimony",
      error: error.message,
    });
  }
};

export const deleteTestimony = async (req, res) => {
  try {
    const { id } = req.params;

    const testimony = await Testimony.findByIdAndDelete(id);

    if (!testimony) {
      return res.status(404).json({
        message: "Testimony not found",
        success: false,
      });
    }

    await logActivity("TESTIMONY", "DELETED", testimony);

    return res.status(200).json({
      message: "Testimony deleted successfully",
      success: true,
    });
  } catch (error) {
    logger.error("Failed to delete Testimony:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete Testimony",
      error: error.message,
    });
  }
};
