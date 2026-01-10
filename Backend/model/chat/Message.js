import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true }, // Links to the Request ID
  authorId: { type: String, required: true },
  authorName: { type: String },
  message: { type: String, required: true },
  time: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Message", MessageSchema);