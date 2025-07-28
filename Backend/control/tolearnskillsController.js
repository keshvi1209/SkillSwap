import ToLearn from "../model/tolearnskillsModel.js";

export const tolearnskills = async (req, res) => {
  try {
    const {
      skill,
      proficiency,
      mode,
      languages,
      tags,
    } = req.body;


    const newEntry = await ToLearn.create({
      skill,
      proficiency,
      mode,
      languages: Array.isArray(req.body.languages) ? req.body.languages : [req.body.languages],
      tags: Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags],
    });

    res.status(201).json({ message: "Skill added successfully!", data: newEntry });
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).json({ error: "Server error" });
  }
};