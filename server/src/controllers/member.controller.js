import Member from "../db/models/member.model.js";
import { logger } from "../utils/logger.js";
import { logActivity } from "../utils/activity.queue.js";
import { response } from "../utils/response.js";

/**
 * Create a new member
 */
export const createMember = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      birthday,
      address,
      departmentOfInterest = "none",
      imageUrl,
      joinedAt,
    } = req.body;

    if (!fullName || !email || !phone || !birthday || !address) {
      return response(res, 400, "Full name and email are required.");
    }

    // ✅ Convert birthday from "YYYY-MM-DD" string to Date (if provided)
    let parsedBirthday = null;
    if (birthday && birthday.trim() !== "") {
      const date = new Date(birthday);
      if (isNaN(date.getTime())) {
        return response(res, 400, "Invalid birthday format. Expected YYYY-MM-DD.");
      }
      parsedBirthday = date;
    }

    const member = await Member.create({
      fullName,
      email,
      phone,
      birthday: parsedBirthday,
      address,
      departmentOfInterest,
      imageUrl,
      joinedAt,
    });

    logActivity("MEMBER", "NEW", member);

    return response(res, 201, "Member created successfully", member);
  } catch (error) {
    logger.error("Create Member Error:", error);
    return response(res, 500, "Failed to create member", undefined, {
      error: error.message,
    });
  }
};

/**
 * Get all members
 */
export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    return response(res, 200, "Members fetched successfully", members, {
      count: members.length,
    });
  } catch (error) {
    return response(res, 500, "Failed to fetch members", undefined, {
      error: error.message,
    });
  }
};

/**
 * Get a single member by ID
 */
export const getSingleMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findById(id);

    if (!member) {
      return response(res, 404, "Member not found");
    }

    return response(res, 200, "Member fetched successfully", member);
  } catch (error) {
    return response(res, 500, "Failed to fetch member", undefined, {
      error: error.message,
    });
  }
};

/**
 * Update a member by ID
 */
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedMember = await Member.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMember) {
      return response(res, 404, "Member not found");
    }

    logActivity("MEMBER", "UPDATED", updatedMember);

    return response(res, 200, "Member updated successfully", updatedMember);
  } catch (error) {
    return response(res, 500, "Failed to update member", undefined, {
      error: error.message,
    });
  }
};

/**
 * Delete a member by ID
 */
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      return response(res, 404, "Member not found");
    }

    logActivity("MEMBER", "DELETED", deletedMember);

    return response(res, 200, "Member deleted successfully");
  } catch (error) {
    return response(res, 500, "Failed to delete member", undefined, {
      error: error.message,
    });
  }
};
