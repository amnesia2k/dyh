import Event from "../db/models/event.model.js";
import { logger } from "../utils/logger.js";
import { logActivity } from "../utils/activity.queue.js";
import { response } from "../utils/response.js";

export const createEvent = async (req, res) => {
  try {
    const { title, date, location, description, featured, imageUrl } = req.body;

    if (!title || !date) {
      return response(res, 400, "Title and date are required");
    }

    const event = await Event.create({
      title,
      date,
      location,
      description,
      featured,
      imageUrl,
    });

    logActivity("EVENT", "NEW", event);

    logger.info("Event created:", event._id);

    return response(res, 201, "Event created", event);
  } catch (error) {
    logger.error("Error creating event:", error);
    return response(res, 500, "Internal Server error", undefined, {
      error: error.message,
    });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    const events = await Event.find(query).sort({ date: -1 });
    const count = await Event.countDocuments();

    logger.info(`Fetched ${events.length} events`);

    return response(res, 200, "Events fetched", events, {
      count,
    });
  } catch (error) {
    logger.error("Error fetching events:", error);
    return response(res, 500, "Internal Server error", undefined, {
      error: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return response(res, 404, "Event not found");
    }

    logger.info("Fetched event:", event._id);

    return response(res, 200, "Event fetched", event);
  } catch (error) {
    logger.error("Error fetching event by id:", error);
    return response(res, 500, "Internal Server error", undefined, {
      error: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!event) {
      return response(res, 404, "Event not found");
    }

    logActivity("EVENT", "UPDATED", event);

    logger.info("Updated event:", event._id);

    return response(res, 200, "Event updated", event);
  } catch (error) {
    logger.error("Error updating event:", error);
    return response(res, 500, "Internal Server error", undefined, {
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return response(res, 404, "Event not found");
    }

    logActivity("EVENT", "DELETED", event);

    logger.info("Deleted event:", event._id);

    return response(res, 200, "Event deleted");
  } catch (error) {
    logger.error("Error deleting event:", error);
    return response(res, 500, "Internal Server error", undefined, {
      error: error.message,
    });
  }
};
