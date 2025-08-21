import HeadOfTribe from "../db/models/hot.model.js";

// CREATE HOT
export const createHot = async (req, res) => {
  try {
    const { fullName, tribe, photo, phone, email } = req.body;
    if (!fullName || !tribe) {
      return res.status(400).json({
        message: "Name and tribe are required.",
        success: false,
      });
    }

    const newHot = await HeadOfTribe.create({
      fullName,
      tribe,
      photo,
      phone,
      email,
    });

    res.status(201).json({
      message: "Head of Tribe created successfully",
      success: true,
      data: newHot,
    });
  } catch (err) {
    console.error("❌ createHOT error:", err.message);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// GET ALL HOTs
export const getAllHots = async (_req, res) => {
  try {
    const hots = await HeadOfTribe.find();
    res.status(200).json({
      message: "HOTs fetched successfully",
      success: true,
      data: hots,
    });
  } catch (err) {
    console.error("❌ getAllHOTs error:", err.message);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// GET SINGLE HOT
export const getSingleHot = async (req, res) => {
  try {
    const hot = await HeadOfTribe.findById(req.params.id);
    if (!hot) {
      return res.status(404).json({ message: "HOT not found", success: false });
    }
    res
      .status(200)
      .json({ message: "HOT fetched successfully", success: true, data: hot });
  } catch (err) {
    console.error("❌ getSingleHOT error:", err.message);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// UPDATE HOT
export const updateHot = async (req, res) => {
  try {
    const hot = await HeadOfTribe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hot) {
      return res.status(404).json({ message: "HOT not found", success: false });
    }

    res.status(200).json({
      message: "HOT updated successfully",
      success: true,
      data: hot,
    });
  } catch (err) {
    console.error("❌ updateHOT error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE HOT
export const deleteHot = async (req, res) => {
  try {
    const hot = await HeadOfTribe.findByIdAndDelete(req.params.id);
    if (!hot) {
      return res.status(404).json({ message: "HOT not found", success: false });
    }

    res.status(200).json({
      message: "HOT deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error("❌ deleteHOT error:", err.message);
    res.status(500).json({ message: "Server error", success: false });
  }
};
