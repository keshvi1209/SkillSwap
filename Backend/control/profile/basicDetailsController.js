import User from "../../model/user/user.js";

// GET endpoint to fetch user details - matches frontend GET request
export const getupdateddetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const userDetails = await User.findOne({ _id: userId });
    if (!userDetails) {
      return res.status(200).json({}); // return empty object if no details found
    }
    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error while fetching details" });
  }
};

// POST endpoint to update user details - matches frontend POST request
export const updatedetails = async (req, res) => {
  try {
    const { userId, contact, address, city, state } = req.body;

    let userDetails = await User.findOne({ _id: userId });
    if (!userDetails) {
      // create new entry if not exists
      userDetails = new User({
        _id: userId,
        contact,
        address,
        city,
        state,
      });
    } else {
      // update only provided fields
      userDetails.contact = contact || userDetails.contact;
      userDetails.address = address || userDetails.address;
      userDetails.city = city || userDetails.city;
      userDetails.state = state || userDetails.state;
    }
    await userDetails.save();
    res.json(userDetails);
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Server error while updating details" });
  }
};