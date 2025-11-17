import ActivityLog from "../db/models/activity.model.js";
import { logger } from "./logger.js";
import { eventBus } from "./event-bus.js";

function buildActivityMessage(action, type, meta = {}) {
  const safe = meta || {};

  switch (action) {
    case "MEMBER": {
      const name = safe.fullName || "Member";
      if (type === "NEW") return `${name} just registered`;
      if (type === "UPDATED") return `Member ${name} was updated`;
      if (type === "DELETED") return `Member ${name} was deleted`;
      break;
    }

    case "HOT": {
      const name = safe.name || "HoT";
      if (type === "NEW") return `New HoT added: ${name}`;
      if (type === "UPDATED") return `HoT ${name} was updated`;
      if (type === "DELETED") return `HoT ${name} was deleted`;
      break;
    }

    case "SERMON": {
      const title = safe.title || "Sermon";
      if (type === "NEW") return `New sermon added: ${title}`;
      if (type === "UPDATED") return `Sermon updated: ${title}`;
      if (type === "DELETED") return `Sermon deleted: ${title}`;
      break;
    }

    case "EVENT": {
      const title = safe.title || "Event";
      if (type === "NEW") return `New event added: ${title}`;
      if (type === "UPDATED") return `Event updated: ${title}`;
      if (type === "DELETED") return `Event deleted: ${title}`;
      break;
    }

    case "ANNOUNCEMENT": {
      const title = safe.title || "Announcement";
      if (type === "NEW") return `New announcement added: ${title}`;
      if (type === "UPDATED") return `Announcement updated: ${title}`;
      if (type === "DELETED") return `Announcement deleted: ${title}`;
      break;
    }

    case "PRAYER_REQUEST": {
      const name = safe.anonymous ? "Anonymous" : safe.fullName || "Someone";
      if (type === "NEW") return `New prayer request from ${name}`;
      if (type === "UPDATED") return `Prayer request from ${name} was updated`;
      break;
    }

    case "TESTIMONY": {
      const name = safe.anonymous ? "Anonymous" : safe.fullName || "Someone";
      if (type === "NEW") return `New testimony from ${name}`;
      if (type === "UPDATED") return `Testimony from ${name} was updated`;
      if (type === "DELETED") return `Testimony from ${name} was deleted`;
      break;
    }

    default:
      break;
  }

  return `${action} ${type.toLowerCase()}`;
}

eventBus.on("activity:log", async ({ action, type, meta }) => {
  try {
    const cleanMeta = meta && typeof meta.toObject === "function" ? meta.toObject() : meta || {};

    const message = buildActivityMessage(action, type, cleanMeta);

    await ActivityLog.create({ action, type, message, meta: cleanMeta });
    logger.info("Activity logged", { action, type, message });
  } catch (error) {
    logger.error("Failed to log activity", error);
  }
});

export function logActivity(action, type, meta = {}) {
  eventBus.emit("activity:log", { action, type, meta });
}
