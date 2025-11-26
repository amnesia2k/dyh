import Sermon from "../db/models/sermon.model.js";
import { logger } from "../utils/logger.js";
import { logActivity } from "../utils/activity.queue.js";
import { response } from "../utils/response.js";

/**
 * @desc Create a new sermon
 * @route POST /api/sermons
 */
export const createSermon = async (req, res) => {
  try {
    const { title, date, spotifyEmbedUrl, description, speaker } = req.body;

    if (!title || !date || !spotifyEmbedUrl || !description || !speaker) {
      return response(res, 400, "All fields are required");
    }

    const sermon = await Sermon.create({
      title,
      date,
      spotifyEmbedUrl,
      description,
      speaker,
    });

    logActivity("SERMON", "NEW", sermon);

    logger.info("Sermon created:", sermon._id);
    return response(res, 201, "Sermon created", sermon);
  } catch (error) {
    logger.error("Error creating sermon:", error);
    return response(res, 500, "Internal Server error", undefined, {
      error: error.message,
    });
  }
};

/**
 * @desc Get all sermons (with optional search)
 * @route GET /api/sermons
 */
export const getSermons = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    const sermons = await Sermon.find(query).sort({ date: -1 });

    const count = await Sermon.countDocuments();

    logger.info(`Fetched ${sermons.length} sermons`);
    return response(res, 200, "Sermons fetched", sermons, { count });
  } catch (error) {
    logger.error("Error fetching sermons:", error);
    return response(res, 500, "Internal Server error", undefined, {
      error: error.message,
    });
  }
};

/**
 * @desc Get single sermon by ID
 * @route GET /api/sermons/:id
 */
export const getSermonById = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);

    if (!sermon) {
      return response(res, 404, "Sermon not found");
    }

    logActivity("SERMON", "UPDATED", sermon);

    logger.info("Fetched sermon:", sermon._id);
    return response(res, 200, "Sermon fetched", sermon);
  } catch (error) {
    logger.error("Error fetching sermon by id:", error);
    return response(res, 500, "Internal Server error", undefined, {
      error: error.message,
    });
  }
};

/**
 * @desc Update sermon
 * @route PUT /api/sermons/:id
 */
export const updateSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!sermon) {
      return response(res, 404, "Sermon not found");
    }

    logActivity("SERMON", "DELETED", sermon);

    logger.info("Updated sermon:", sermon._id);
    return response(res, 200, "Sermon updated", sermon);
  } catch (error) {
    logger.error("Error updating sermon:", error);
    return response(res, 500, "Internal Server error", undefined, {
      error: error.message,
    });
  }
};

/**
 * @desc Delete sermon
 * @route DELETE /api/sermons/:id
 */
export const deleteSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndDelete(req.params.id);

    if (!sermon) {
      return response(res, 404, "Sermon not found");
    }

    logger.info("Deleted sermon:", sermon._id);
    return response(res, 200, "Sermon deleted");
  } catch (error) {
    logger.error("Error deleting sermon:", error);
    return response(res, 500, "Internal Server error", undefined, {
      error: error.message,
    });
  }
};
