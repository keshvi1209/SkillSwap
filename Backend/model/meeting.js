import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skillName: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  meetLink: { type: String, required: true },
  googleEventId: { type: String }, // Optional: to update/delete later
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;