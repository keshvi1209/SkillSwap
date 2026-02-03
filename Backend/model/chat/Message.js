import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderEmail: {
    type: String,
    required: true,
    index: true // Indexed for faster lookups
  },
  receiverEmail: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  // Useful for your Skill-Sharing UI to show names without extra API calls
  senderName: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true // This automatically adds 'createdAt' and 'updatedAt'
});

// Compound index to quickly fetch conversation history between two users
messageSchema.index({ senderEmail: 1, receiverEmail: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;