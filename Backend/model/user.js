import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  canTeach: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Canteach" }
  ],
  toLearn: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ToLearn" }
  ]
,},{
  timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;
