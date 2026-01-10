import mongoose from "mongoose";

const tolearnSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    proficiency: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    mode: { type: String, enum: ["online", "offline", "both"], required: true },
    languages: { type: [String], required: true }, 
    tags: { type: [String], required: true },
  },
  {
  timestamps: true,
  }
);

const ToLearn = mongoose.model("ToLearn", tolearnSchema);
export default ToLearn;
