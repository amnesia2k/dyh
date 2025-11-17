import Event from "../db/models/event.model.js";
import { logger } from "../utils/logger.js";
import { logActivity } from "../utils/activity.queue.js";

export const createEvent = async (req, res) => {
  try {
    const { title, date, location, description, featured, imageUrl } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        message: "Title and date are required",
        success: false,
      });
    }

    const event = await Event.create({
      title,
      date,
      location,
      description,
      featured,
      imageUrl,
    });

    await logActivity("EVENT", "NEW", event);

    logger.info("Event created:", event._id);

    return res.status(201).json({
      message: "Event created",
      success: true,
      data: event,
    });
  } catch (error) {
    logger.error("Error creating event:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
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

    return res.status(200).json({
      message: "Events fetched",
      success: true,
      count,
      data: events,
    });
  } catch (error) {
    logger.error("Error fetching events:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
        success: false,
      });
    }

    logger.info("Fetched event:", event._id);

    return res.status(200).json({
      message: "Event fetched",
      success: true,
      data: event,
    });
  } catch (error) {
    logger.error("Error fetching event by id:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
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
      return res.status(404).json({
        message: "Event not found",
        success: false,
      });
    }

    await logActivity("EVENT", "UPDATED", event);

    logger.info("Updated event:", event._id);

    return res.status(200).json({
      message: "Event updated",
      success: true,
      data: event,
    });
  } catch (error) {
    logger.error("Error updating event:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
        success: false,
      });
    }

    await logActivity("EVENT", "DELETED", event);

    logger.info("Deleted event:", event._id);

    return res.status(200).json({
      message: "Event deleted",
      success: true,
    });
  } catch (error) {
    logger.error("Error deleting event:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};
