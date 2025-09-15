import User from "../model/user.js";

export const setCanTeachPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { canTeachPreferences: preferences },
      { new: true, runValidators: true }
    ).select("canTeachPreferences");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      message: "CanTeach preferences updated",
      canTeachPreferences: user.canTeachPreferences,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const setToLearnPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { toLearnPreferences: preferences },
      { new: true, runValidators: true }
    ).select("toLearnPreferences");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "ToLearn preferences updated", 
toLearnPreferences:user.toLearnPreferences });   
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
