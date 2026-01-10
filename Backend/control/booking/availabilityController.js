import Availability from "../../model/booking/availabilityModel.js";

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
    const userId = req.params.userId;

    console.log("Fetching availability for user:", userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required."
      });
    }

    // Validate userId is a valid ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID format."
      });
    }

    const availability = await Availability.findOne({ user: userId })
      .populate("user", "name email")
      .lean(); // Use lean() for better performance

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "No availability found for this user."
      });
    }

    console.log("Found availability:", JSON.stringify(availability, null, 2));

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};