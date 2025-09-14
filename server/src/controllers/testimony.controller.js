import { Testimony } from "../db/models/testimony.model.js";
import { logger } from "../utils/logger.js";

export const createTestimony = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

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
      // anonymous,
    });

    return res.status(201).json({
      message: "Testimony created successfully",
      success: true,
      data: testimony,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create Testimony",
      error: error.message,
    });
  }
};

export const getAllPRs = async (req, res) => {
  try {
    const prayerRequests = await Testimony.find().sort({ createdAt: -1 });

    const totalRequests = await Testimony.countDocuments();

    logger.info(`Total Prayer Requests: ${totalRequests}`);

    return res.status(200).json({
      message: "Prayer requests fetched successfully",
      success: true,
      count: totalRequests,
      data: prayerRequests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get Prayer Requests",
      error: error.message,
    });
  }
};

export const getSinglePR = async (req, res) => {
  try {
    const request = await PrayerRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Prayer request not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Prayer Request fetched successfully",
      success: true,
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get Prayer Request",
      error: error.message,
    });
  }
};

export const updatePRStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await PrayerRequest.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!request) {
      return res.status(404).json({
        message: "Prayer request not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Prayer Request updated successfully",
      success: true,
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update Prayer Request",
      error: error.message,
    });
  }
};
