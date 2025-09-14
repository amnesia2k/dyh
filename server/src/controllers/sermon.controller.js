import Sermon from "../db/models/sermon.model.js";
import { logger } from "../utils/logger.js";

/**
 * @desc Create a new sermon
 * @route POST /api/sermons
 */
export const createSermon = async (req, res) => {
  try {
    const { title, date, spotifyEmbedUrl, description, speaker } = req.body;

    if (!title || !date || !spotifyEmbedUrl || !description || !speaker) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const sermon = await Sermon.create({
      title,
      date,
      spotifyEmbedUrl,
      description,
      speaker,
    });

    logger.info("Sermon created:", sermon._id);
    res.status(201).json({ message: "Sermon created", success: true, data: sermon });
  } catch (error) {
    logger.error("Error creating sermon:", error);
    res.status(500).json({ message: "Internal Server error", success: false });
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
    res.status(200).json({
      message: "Sermons fetched",
      success: true,
      count,
      data: sermons,
    });
  } catch (error) {
    logger.error("Error fetching sermons:", error);
    res.status(500).json({ message: "Internal Server error", success: false });
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
      return res.status(404).json({ message: "Sermon not found", success: false });
    }

    logger.info("Fetched sermon:", sermon._id);
    res.status(200).json({ message: "Sermon fetched", success: true, data: sermon });
  } catch (error) {
    logger.error("Error fetching sermon by id:", error);
    res.status(500).json({ message: "Internal Server error", success: false });
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
      return res.status(404).json({ message: "Sermon not found", success: false });
    }

    logger.info("Updated sermon:", sermon._id);
    res.status(200).json({ message: "Sermon updated", success: true, data: sermon });
  } catch (error) {
    logger.error("Error updating sermon:", error);
    res.status(500).json({ message: "Internal Server error", success: false });
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
      return res.status(404).json({ success: false, message: "Sermon not found" });
    }

    logger.info("Deleted sermon:", sermon._id);
    res.status(200).json({ message: "Sermon deleted", success: true });
  } catch (error) {
    logger.error("Error deleting sermon:", error);
    res.status(500).json({ message: "Internal Server error", success: false });
  }
};
