import { PrayerRequest } from "../db/models/pr.model.js";

export const createPR = async (req, res) => {
  try {
    const { fullName, email, message, anonymous = false } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        message: "Full name, email, and message are required.",
        success: false,
      });
    }

    const pr = await PrayerRequest.create({
      fullName,
      email,
      message,
      anonymous,
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
    const prayerRequests = await PrayerRequest.find().sort({ createdAt: -1 });

    const totalRequests = await PrayerRequest.countDocuments();

    // console.log(`Total Prayer Requests: ${totalRequests}`);

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
