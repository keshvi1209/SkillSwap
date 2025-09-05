import User from "../model/user.js";

export const getCanTeachSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("canTeach");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("CanTeach Skills:", user.canTeach);
    res.status(200).json({ canTeach: user.canTeach });
  } catch (error) {
    console.error("Error fetching canTeach skills:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getToLearnSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("toLearn");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("ToLearn Skills:", user.toLearn);
    res.status(200).json({ toLearn: user.toLearn });
  } catch (error) {
    console.error("Error fetching canTeach skills:", error);
    res.status(500).json({ error: "Server error" });
  }
};

