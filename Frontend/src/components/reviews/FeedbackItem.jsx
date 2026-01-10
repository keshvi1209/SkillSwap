import StarRating from "../common/StarRating";

const FeedbackItem = ({ feedback }) => (
  <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700/50 mb-4 hover:border-gray-600/50 transition-all">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-semibold text-white">{feedback.userName}</h4>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(feedback.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <StarRating rating={feedback.rating} />
    </div>
    <p className="text-gray-300 leading-relaxed">{feedback.comment}</p>
  </div>
);

export default FeedbackItem;