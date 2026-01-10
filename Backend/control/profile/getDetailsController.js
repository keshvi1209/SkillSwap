import User from "../../model/user/user.js";

export const getDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("canTeach", "skill") // only fetch skill name
      .populate("toLearn", "skill")  // only fetch skill name
      .select("name email city state canTeach toLearn"); // return only required user fields

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // transform output so canTeach/toLearn return array of skill names instead of objects
    const formattedUser = {
      userId: user._id,
      name: user.name,
      email: user.email,
      city: user.city || "",
      state: user.state || "",
      canTeach: user.canTeach.map((s) => s.skill),
      toLearn: user.toLearn.map((s) => s.skill),
    };

    res.json(formattedUser);
  } catch (err) {
    console.error("Error in getDetails:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get user details by ID
export const getusercompletedetails = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("request for user details of ID:", userId);

    const user = await User.findById(userId)
      .populate({
        path: "canTeach",
        select: "skill experience description proficiency mode languages tags availability",
      })
      .populate({
        path: "toLearn",
        select: "skill proficiency mode languages tags",
      })
      .select("name email city state contact address canTeach toLearn ");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Format the response
    const formattedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      // profilePic: user.profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      email: user.email,
      phone: user.contact || "Not provided",
      location: `${user.city || ""}, ${user.state || ""}`.trim() || "Location not specified",
      address: user.address || "",
      // rating: 4.7, // You might want to calculate this dynamically
      // feedback: [], // You might want to fetch real feedback from another collection
      canTeach: user.canTeach || [],
      toLearn: user.toLearn || [],
    };

    res.json(formattedUser);
  } catch (err) {
    console.error("Error in getUserDetails:", err);
    res.status(500).json({ error: "Server error" });
  }
};


