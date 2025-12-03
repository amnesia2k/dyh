import ActivityLog from "../db/models/activity.model.js";
import { buildSearchFilter } from "../utils/search.js";
import { response } from "../utils/response.js";

export const getAllActivities = async (req, res) => {
  try {
    const searchFilter = buildSearchFilter(req.query, ["action", "type", "message"]);
    const activities = await ActivityLog.find(searchFilter ?? {}).sort({ createdAt: -1 });

    return response(res, 200, "Activities fetched successfully", activities);
  } catch (error) {
    return response(res, 500, "Failed to get activities", undefined, {
      error: error.message,
    });
  }
};
