import { Testimony } from "../db/models/testimony.model.js";
import { logger } from "../utils/logger.js";
import { logActivity } from "../utils/activity.queue.js";
import { response } from "../utils/response.js";

export const createTestimony = async (req, res) => {
  try {
    const { fullName, email, message, anonymous, status } = req.body;

    if (!fullName || !email || !message) {
      return response(res, 400, "All fields are required.");
    }

    const testimony = await Testimony.create({
      fullName,
      email,
      message,
      anonymous,
      status,
    });

    logActivity("TESTIMONY", "NEW", testimony);

    return response(res, 201, "Testimony created successfully", testimony);
  } catch (error) {
    logger.error("Failed to create Testimony:", error);
    return response(res, 500, "Failed to create Testimony", undefined, {
      error: error.message,
    });
  }
};

export const getTestimonies = async (_req, res) => {
  try {
    const testimonies = await Testimony.find().sort({ createdAt: -1 });
    const count = await Testimony.countDocuments();

    logger.info(`Total Testimonies: ${count}`);

    return response(res, 200, "Testimonies fetched successfully", testimonies, {
      count,
    });
  } catch (error) {
    logger.error("Failed to get Testimonies:", error);
    return response(res, 500, "Failed to get Testimonies", undefined, {
      error: error.message,
    });
  }
};

export const getTestimonyById = async (req, res) => {
  try {
    const testimony = await Testimony.findById(req.params.id);

    if (!testimony) {
      return response(res, 404, "Testimony not found");
    }

    return response(res, 200, "Testimony fetched successfully", testimony);
  } catch (error) {
    logger.error("Failed to get Testimony:", error);
    return response(res, 500, "Failed to get Testimony", undefined, {
      error: error.message,
    });
  }
};

export const updateTestimony = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };

    if (update.approved === true && !update.approvedAt) {
      update.approvedAt = new Date();
    }

    const testimony = await Testimony.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!testimony) {
      return response(res, 404, "Testimony not found");
    }

    logActivity("TESTIMONY", "UPDATED", testimony);

    return response(res, 200, "Testimony updated successfully", testimony);
  } catch (error) {
    logger.error("Failed to update Testimony:", error);
    return response(res, 500, "Failed to update Testimony", undefined, {
      error: error.message,
    });
  }
};

export const deleteTestimony = async (req, res) => {
  try {
    const { id } = req.params;

    const testimony = await Testimony.findByIdAndDelete(id);

    if (!testimony) {
      return response(res, 404, "Testimony not found");
    }

    logActivity("TESTIMONY", "DELETED", testimony);

    return response(res, 200, "Testimony deleted successfully");
  } catch (error) {
    logger.error("Failed to delete Testimony:", error);
    return response(res, 500, "Failed to delete Testimony", undefined, {
      error: error.message,
    });
  }
};
