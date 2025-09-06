import User from "../model/user.js";

// PATCH /api/users/:id/canteachpreferences
export const setCanTeachPreferences = async (req, res) => {
  try {
    const { preferences } = req.body; 

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { canTeachPreferences: preferences },
      { new: true, runValidators: true }
    ).select("canTeachPreferences name email");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      message: "CanTeach preferences updated",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/users/:id/tolearnpreferences
export const setToLearnPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { toLearnPreferences: preferences },
      { new: true, runValidators: true }
    ).select("toLearnPreferences name email");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "ToLearn preferences updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

