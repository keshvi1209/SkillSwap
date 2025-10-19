import { useState } from "react";
import StarRating from "./StarRating";

const FeedbackForm = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
      <h4 className="text-lg font-semibold text-white mb-4">Share Your Experience</h4>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-300 mb-2">Your Rating</label>
        <StarRating rating={rating} setRating={setRating} editable={true} />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-300 mb-2">Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Tell us about your experience with this teacher..."
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-all font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all font-medium shadow-lg shadow-indigo-500/20"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;