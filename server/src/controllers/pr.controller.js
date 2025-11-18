import { PrayerRequest } from "../db/models/pr.model.js";
import { logActivity } from "../utils/activity.queue.js";
import { logger } from "../utils/logger.js";
import { response } from "../utils/response.js";

export const createPR = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
      return response(res, 400, "All fields are required.");
    }

    const pr = await PrayerRequest.create({
      fullName,
      email,
      message,
      // anonymous,
    });

    logActivity("PRAYER_REQUEST", "NEW", pr);

    return response(res, 201, "Prayer Request created successfully", pr);
  } catch (error) {
    return response(res, 500, "Failed to create Prayer Request", undefined, {
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

    return response(res, 200, "Prayer requests fetched successfully", prayerRequests, {
      count: totalRequests,
    });
  } catch (error) {
    return response(res, 500, "Failed to get Prayer Requests", undefined, {
      error: error.message,
    });
  }
};

export const getSinglePR = async (req, res) => {
  try {
    const request = await PrayerRequest.findById(req.params.id);

    if (!request) {
      return response(res, 404, "Prayer request not found");
    }

    return response(res, 200, "Prayer Request fetched successfully", request);
  } catch (error) {
    return response(res, 500, "Failed to get Prayer Request", undefined, {
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
      return response(res, 404, "Prayer request not found");
    }

    logActivity("PRAYER_REQUEST", "UPDATED", request);

    return response(res, 200, "Prayer Request updated successfully", request);
  } catch (error) {
    return response(res, 500, "Failed to update Prayer Request", undefined, {
      error: error.message,
    });
  }
};
