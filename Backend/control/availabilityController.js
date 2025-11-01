import Availability from "../model/availabilityModel.js";

export const saveAvailability = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.user; 
    const { availability } = req.body
    console.log(availability)
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    if (!availability || !Array.isArray(availability)) {
      return res.status(400).json({ message: "Invalid availability data." });
    }

    const updated = await Availability.findOneAndUpdate(
      { user: userId },
      { availability },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Availability saved successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Error saving availability:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAvailability = async (req, res) => {
  try {
    const userId = req.body.user;
    const availability = await Availability.findOne({ user: userId }).populate(
      "user",
      "name email"
    );

    if (!availability) {
      return res.status(404).json({ message: "No availability found." });
    }

    res.status(200).json({ success: true, data: availability });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
