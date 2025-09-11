import User from "../model/user.js";

const recommendations =  async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const matchedUsers = await User.find({
      _id: { $ne: currentUser._id }, 
      $or: [
        { canTeachPreferences: { $in: currentUser.toLearnPreferences } },
        { toLearnPreferences: { $in: currentUser.canTeachPreferences } }
      ]
    }).select("_id"); 
    const recommendations = matchedUsers.map(user => user._id);

    res.json({ recommendations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default recommendations;
