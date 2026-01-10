import ToLearn from "../../model/skills/tolearnskillsModel.js";
import User from "../../model/user/user.js";

export const tolearnskills = async (req, res) => {
  try {
    const { skill, proficiency, mode, languages, tags } = req.body;

    const newEntry = await ToLearn.create({
      skill,
      proficiency,
      mode,
      languages: Array.isArray(languages) ? languages : [languages],
      tags: Array.isArray(tags) ? tags : [tags],
    });

    await User.findByIdAndUpdate(req.user.id, { $push: { toLearn: newEntry._id } });

    res.status(201).json({ message: "Skill added successfully!", data: newEntry });
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).json({ error: "Server error" });
  }
};
