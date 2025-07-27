
import mongoose from "mongoose";

const canteachSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    experience: { type: Number, required: true },
    description: { type: String, required: true },
    proficiency: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    mode: { type: String, enum: ["online", "offline", "both"], required: true },
    languages: { type: [String], required: true },
    tags: { type: [String], required: true },
    availability: { type: Object, required: true },
    certificates: [String], 
  }
);

const Canteach = mongoose.model("Canteach", canteachSchema);
export default Canteach;
