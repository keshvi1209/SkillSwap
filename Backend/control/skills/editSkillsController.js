import Canteach from "../../model/skills/canteachskillsModel.js";

export const getcanteachbyid = async (req, res) => {
  try {
    const skill = await Canteach.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json(skill);
  } catch (error) {
    console.error("GET error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const putcanteachbyid = async (req, res) => {
  try {
    let {
      skill,
      experience,
      description,
      proficiency,
      mode,
      languages,
      tags,
      availability,
    } = req.body;

    // ✅ Handle languages
    if (Array.isArray(languages)) {
      // already array
    } else if (typeof languages === "string") {
      languages = languages
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);
    } else {
      languages = [];
    }

    // ✅ Handle tags
    if (Array.isArray(tags)) {
      // already array
    } else if (typeof tags === "string") {
      tags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else {
      tags = [];
    }

    // ✅ Handle availability
    if (availability) {
      try {
        if (typeof availability === "string") {
          availability = JSON.parse(availability);
        }
        // if already object, do nothing
      } catch (err) {
        return res.status(400).json({ message: "Invalid availability format" });
      }
    } else {
      availability = null;
    }

    // ✅ Update DB
    const updatedSkill = await Canteach.findByIdAndUpdate(
      req.params.id,
      {
        skill,
        experience,
        description,
        proficiency,
        mode,
        languages,
        tags,
        availability,
      },
      { new: true }
    );

    if (!updatedSkill)
      return res.status(404).json({ message: "Skill not found" });

    res.json({ message: "Skill updated successfully", updatedSkill });
  } catch (error) {
    console.error("PUT error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
