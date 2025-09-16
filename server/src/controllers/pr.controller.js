import { PrayerRequest } from "../db/models/pr.model.js";
import { logActivity } from "../utils/activity.queue.js";
import { logger } from "../utils/logger.js";

export const createPR = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const pr = await PrayerRequest.create({
      fullName,
      email,
      message,
      // anonymous,
    });

    await logActivity({
      type: "prayer",
      action: "created",
      refId: pr._id,
      summary: `Prayer Request created by ${fullName}`,
    });

    return res.status(201).json({
      message: "Prayer Request created successfully",
      success: true,
      data: pr,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create Prayer Request",
      error: error.message,
    });
  }
};

export const getAllPRs = async (req, res) => {
  try {
    const [prayerRequests, totalRequests] = await Promise.all([
      PrayerRequest.find().sort({ createdAt: -1 }),
      PrayerRequest.countDocuments(),
    ]);

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

    await logActivity({
      type: "prayer",
      action: "updated",
      refId: request._id,
      summary: `Prayer Request status updated`, // by ${fullName}
    });

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
