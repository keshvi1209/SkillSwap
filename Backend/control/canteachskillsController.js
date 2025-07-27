import Canteach  from "../model/canteachskillsModel.js";

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
      availability,
    } = req.body;

    const certificatePaths = req.files.map(file => file.path);

    const newEntry = await Canteach.create({
      skill,
      experience,
      description,
      proficiency,
      mode,
      languages: Array.isArray(req.body.languages) ? req.body.languages : [req.body.languages],
      tags: Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags],
      availability: JSON.parse(availability),
      certificates: certificatePaths,
    });

    res.status(201).json({ message: "Skill added successfully!", data: newEntry });
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).json({ error: "Server error" });
  }
};