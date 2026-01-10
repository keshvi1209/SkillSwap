import mongoose from "mongoose";

// Schema for each individual time slot
const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,     // e.g. "5:00 PM"
  },
  endTime: {
    type: String,
    required: true,     // e.g. "6:00 PM"
  },
  startTime24: {
    type: String,
    required: true,     // e.g. "17:00"
  },
  endTime24: {
    type: String,
    required: true,     // e.g. "18:00"
  },
  booked: {
    
    type: Boolean,
    default: false,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
}, { _id: true }); // keep _id for each slot (helps for updates)

// Schema for each day’s availability
const dayAvailabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  slots: {
    type: [timeSlotSchema], // multiple time slots per day
    default: [],
  },
}, { _id: true });

// Schema for user’s overall availability
const availabilitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  availability: {
    type: [dayAvailabilitySchema], // multiple days per user
    default: [],
  },
}, { timestamps: true });

export default mongoose.model("Availability", availabilitySchema);
