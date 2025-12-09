import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String },
  studentEmail: { type: String },
  teacherId: { type: String, required: true },
  skillName: { type: String },
  selectedSlots: [{
    slotId: { type: String },
    day: { type: String },
    startTime: { type: String },
    endTime: { type: String }
  }],
  message: { type: String },
  status: { type: String, default: 'pending' } 
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);