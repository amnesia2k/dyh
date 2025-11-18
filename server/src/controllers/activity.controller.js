import ActivityLog from "../db/models/activity.model.js";
import { response } from "../utils/response.js";

export const getAllActivities = async (_req, res) => {
  try {
    const activities = await ActivityLog.find().sort({ createdAt: -1 });

    return response(res, 200, "Activities fetched successfully", activities);
  } catch (error) {
    return response(res, 500, "Failed to get activities", undefined, {
      error: error.message,
    });
  }
};
