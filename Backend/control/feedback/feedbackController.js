import Feedback from "../../model/feedback/feedbackModel.js";
import User from "../../model/user/user.js";

export const submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { teacherId } = req.params;
    const studentId = req.user.id; // from auth middleware

    if (!rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (teacherId === studentId) {
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const alreadyReviewed = await Feedback.findOne({
      teacher: teacherId,
      student: studentId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already submitted feedback" });
    }

    // Create feedback
    let feedback = await Feedback.create({
      teacher: teacherId,
      student: studentId,
      rating,
      comment,
    });

    // 🔥 Populate student details
    feedback = await feedback.populate("student", "name email avatar");

    res.status(201).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTeacherFeedback = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const feedbacks = await Feedback.find({ teacher: teacherId })
      .populate("student", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
