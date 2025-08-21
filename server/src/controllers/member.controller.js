import Member from "../db/models/member.model.js";

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
      photo,
      joinedAt,
    } = req.body;

    if (!fullName || !email || !phone || !birthday || !address) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required.",
      });
    }

    // ✅ Convert birthday from "YYYY-MM-DD" string to Date (if provided)
    let parsedBirthday = null;
    if (birthday && birthday.trim() !== "") {
      const date = new Date(birthday);
      if (isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid birthday format. Expected YYYY-MM-DD.",
        });
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
      photo,
      joinedAt,
    });

    return res.status(201).json({
      message: "Member created successfully",
      success: true,
      data: member,
    });
  } catch (error) {
    console.error("Create Member Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create member",
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

    return res.status(200).json({
      message: "Members fetched successfully",
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch members",
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
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    return res.status(200).json({
      message: "Member fetched successfully",
      success: true,
      data: member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch member",
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
      return res.status(404).json({
        message: "Member not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Member updated successfully",
      success: true,
      data: updatedMember,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update member",
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
      return res.status(404).json({
        message: "Member not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Member deleted successfully",
      success: true,
      // data: deletedMember,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete member",
      error: error.message,
    });
  }
};
