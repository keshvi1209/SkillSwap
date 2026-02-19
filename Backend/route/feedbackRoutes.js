import { Router } from "express";
import { submitFeedback, getTeacherFeedback } from "../control/feedback/feedbackController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// Get reviews (public or private, keeping it flexible)
router.get("/:teacherId", getTeacherFeedback);

// Submit review (protected)
router.post("/:teacherId", authMiddleware, submitFeedback);

export default router;
