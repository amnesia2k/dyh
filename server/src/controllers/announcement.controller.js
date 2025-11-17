import Announcement from "../db/models/announcement.model.js";
import { logger } from "../utils/logger.js";
import { logActivity } from "../utils/activity.queue.js";

export const createAnnouncement = async (req, res) => {
  try {
    const { title, date, summary, body, imageUrl } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        message: "Title and date are required",
        success: false,
      });
    }

    const announcement = await Announcement.create({
      title,
      date,
      summary,
      body,
      imageUrl,
    });

    await logActivity("ANNOUNCEMENT", "NEW", announcement);

    logger.info("Announcement created:", announcement._id);

    return res.status(201).json({
      message: "Announcement created",
      success: true,
      data: announcement,
    });
  } catch (error) {
    logger.error("Error creating announcement:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    const announcements = await Announcement.find(query).sort({ date: -1 });
    const count = await Announcement.countDocuments();

    logger.info(`Fetched ${announcements.length} announcements`);

    return res.status(200).json({
      message: "Announcements fetched",
      success: true,
      count,
      data: announcements,
    });
  } catch (error) {
    logger.error("Error fetching announcements:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found",
        success: false,
      });
    }

    logger.info("Fetched announcement:", announcement._id);

    return res.status(200).json({
      message: "Announcement fetched",
      success: true,
      data: announcement,
    });
  } catch (error) {
    logger.error("Error fetching announcement by id:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found",
        success: false,
      });
    }

    await logActivity("ANNOUNCEMENT", "UPDATED", announcement);

    logger.info("Updated announcement:", announcement._id);

    return res.status(200).json({
      message: "Announcement updated",
      success: true,
      data: announcement,
    });
  } catch (error) {
    logger.error("Error updating announcement:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found",
        success: false,
      });
    }

    await logActivity("ANNOUNCEMENT", "DELETED", announcement);

    logger.info("Deleted announcement:", announcement._id);

    return res.status(200).json({
      message: "Announcement deleted",
      success: true,
    });
  } catch (error) {
    logger.error("Error deleting announcement:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};
