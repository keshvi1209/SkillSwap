import User from "../../model/user/user.js";
import Canteach from "../../model/skills/canteachskillsModel.js";
import ToLearn from "../../model/skills/tolearnskillsModel.js";

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(200).json({ results: [] });
    }

    const searchRegex = new RegExp(query, "i");

    // 1️⃣ Find matching skills
    const matchingCanteachSkills = await Canteach.find({
      skill: searchRegex
    }).select("_id");

    const matchingToLearnSkills = await ToLearn.find({
      skill: searchRegex
    }).select("_id");

    const skillIds = [
      ...matchingCanteachSkills.map(skill => skill._id),
      ...matchingToLearnSkills.map(skill => skill._id)
    ];

    // 2️⃣ Find users
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { city: searchRegex },
        { canTeach: { $in: skillIds } },
        { toLearn: { $in: skillIds } }
      ]
    })
      .populate("canTeach", "skill")
      .populate("toLearn", "skill")
      .select("-password")
      .limit(20);

    res.status(200).json({
      success: true,
      results: users
    });

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

