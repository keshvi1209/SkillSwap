import Canteach from "../model/canteachskillsModel.js";
import User from "../model/user.js";

export const canteachskills = async (req, res) => {
  try {
    const { 
      skill, experience, description, 
      proficiency, mode, languages, tags
    } = req.body;

    console.log("📝 Received canteachskills data:", req.body);

    const certificatePaths = req.files?.map(file => file.path) || [];

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

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { $push: { canTeach: newEntry._id } },
      { new: true }
    );
    console.log("👤 Updated user with new skill:", updatedUser);

    res.status(201).json({ message: "Skill added successfully!", data: newEntry });
  } catch (error) {
    console.error("❌ Error adding skill:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
