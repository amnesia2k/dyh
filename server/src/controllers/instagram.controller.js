import mongoose from "mongoose";
import { InstagramPost } from "../db/models/instagram-post.model.js";
import { logger } from "../utils/logger.js";
import { buildSearchFilter } from "../utils/search.js";
import { response } from "../utils/response.js";

const INSTAGRAM_HOST = "www.instagram.com";

const isValidInstagramPermalink = (value) => {
  if (typeof value !== "string") return false;

  try {
    const parsedUrl = new URL(value);
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname === INSTAGRAM_HOST &&
      pathSegments.length >= 2
    );
  } catch (_error) {
    return false;
  }
};

export const createInstagramPost = async (req, res) => {
  try {
    const rawUrl = typeof req.body?.url === "string" ? req.body.url.trim() : "";

    if (!isValidInstagramPermalink(rawUrl)) {
      return response(res, 400, "Invalid Instagram permalink");
    }

    const embedHtml = `<blockquote class="instagram-media" data-instgrm-permalink="${rawUrl}" data-instgrm-version="14"></blockquote>`;

    const post = await InstagramPost.create({
      url: rawUrl,
      embedHtml,
    });

    return response(res, 201, "Instagram post created successfully", post);
  } catch (error) {
    logger.error("Failed to create Instagram post:", error);

    if (error?.name === "ValidationError") {
      return response(res, 400, "Invalid Instagram URL", undefined, {
        error: error.message,
      });
    }

    return response(res, 500, "Failed to create Instagram post", undefined, {
      error: error.message,
    });
  }
};

export const getInstagramPosts = async (req, res) => {
  try {
    const searchFilter = buildSearchFilter(req.query, ["url"]);
    const posts = await InstagramPost.find(searchFilter ?? {}).sort({ createdAt: -1 });
    return response(res, 200, "Instagram posts fetched successfully", posts);
  } catch (error) {
    logger.error("Failed to fetch Instagram posts:", error);
    return response(res, 500, "Failed to fetch Instagram posts", undefined, {
      error: error.message,
    });
  }
};

export const deleteInstagramPost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(res, 400, "Invalid Instagram post id");
    }

    const deleted = await InstagramPost.findByIdAndDelete(id);

    if (!deleted) {
      return response(res, 404, "Instagram post not found");
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error("Failed to delete Instagram post:", error);
    return response(res, 500, "Failed to delete Instagram post", undefined, {
      error: error.message,
    });
  }
};
