import User from "../model/user.js";

const getDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("canTeach", "skill") // only fetch skill name
      .populate("toLearn", "skill")  // only fetch skill name
      .select("name email canTeach toLearn"); // return only required user fields

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // transform output so canTeach/toLearn return array of skill names instead of objects
    const formattedUser = {
      name: user.name,
      email: user.email,
      canTeach: user.canTeach.map((s) => s.skill),
      toLearn: user.toLearn.map((s) => s.skill),
    };

    res.json(formattedUser);
  } catch (err) {
    console.error("Error in getDetails:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export default getDetails;
