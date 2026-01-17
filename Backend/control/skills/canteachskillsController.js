import Canteach from "../../model/skills/canteachskillsModel.js";
import User from "../../model/user/user.js";

export const canteachskills = async (req, res) => {
  try {
    const {
      skill,
      experience,
      description,
      proficiency,
      mode,
      languages,
      tags,
    } = req.body;

    console.log("📝 Received canteachskills data:", req.body);

    const certificatePaths = req.files?.map((file) => file.path) || [];

    const newEntry = await Canteach.create({
      skill,
      experience,
      description,
      proficiency,
      mode,
      languages: Array.isArray(languages) ? languages : [languages],
      tags: Array.isArray(tags) ? tags : [tags],
      certificates: certificatePaths,
    });

    // PASTE THIS INSTEAD

    // 1. Find the user first to make sure they exist
    const user = await User.findById(req.user.id);

    if (!user) {
      // This will tell you if the ID from the token doesn't match any User in the DB
      console.log("❌ User not found! Token ID:", req.user.id);
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Push the new skill ID into the array
    user.canTeach.push(newEntry._id);

    // 3. Save the user (This will verify the Schema allows this update)
    await user.save();

    console.log("✅ User updated successfully. Current Skills:", user.canTeach);

    res
      .status(201)
      .json({ message: "Skill added successfully!", data: newEntry });
  } catch (error) {
    console.error("❌ Error adding skill:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
