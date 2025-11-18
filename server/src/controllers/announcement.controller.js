import Announcement from "../db/models/announcement.model.js";
import { logger } from "../utils/logger.js";
import { logActivity } from "../utils/activity.queue.js";
import { response } from "../utils/response.js";

export const createAnnouncement = async (req, res) => {
  try {
    const { title, date, summary, body, imageUrl } = req.body;

    if (!title || !date) {
      return response(res, 400, "Title and date are required");
    }

    const announcement = await Announcement.create({
      title,
      date,
      summary,
      body,
      imageUrl,
    });

    logActivity("ANNOUNCEMENT", "NEW", announcement);

    logger.info("Announcement created:", announcement._id);

    return response(res, 201, "Announcement created", announcement);
  } catch (error) {
    logger.error("Error creating announcement:", error);
    return response(res, 500, "Internal Server error", undefined, {
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

    return response(res, 200, "Announcements fetched", announcements, {
      count,
    });
  } catch (error) {
    logger.error("Error fetching announcements:", error);
    return response(res, 500, "Internal Server error", undefined, {
      error: error.message,
    });
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return response(res, 404, "Announcement not found");
    }

    logger.info("Fetched announcement:", announcement._id);

    return response(res, 200, "Announcement fetched", announcement);
  } catch (error) {
    logger.error("Error fetching announcement by id:", error);
    return response(res, 500, "Internal Server error", undefined, {
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
      return response(res, 404, "Announcement not found");
    }

    logActivity("ANNOUNCEMENT", "UPDATED", announcement);

    logger.info("Updated announcement:", announcement._id);

    return response(res, 200, "Announcement updated", announcement);
  } catch (error) {
    logger.error("Error updating announcement:", error);
    return response(res, 500, "Internal Server error", undefined, {
      error: error.message,
    });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return response(res, 404, "Announcement not found");
    }

    logActivity("ANNOUNCEMENT", "DELETED", announcement);

    logger.info("Deleted announcement:", announcement._id);

    return response(res, 200, "Announcement deleted");
  } catch (error) {
    logger.error("Error deleting announcement:", error);
    return response(res, 500, "Internal Server error", undefined, {
      error: error.message,
    });
  }
};
