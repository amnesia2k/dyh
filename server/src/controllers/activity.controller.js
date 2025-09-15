import ActivityLog from "../db/models/activity.model.js";

export const getAllActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Activities fetched successfully",
      success: true,
      data: activities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get activities",
      error: error.message,
    });
  }
};
