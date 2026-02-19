import StarRating from "../common/StarRating";

const FeedbackItem = ({ feedback }) => {
  const userName = feedback.student?.name || feedback.userName || "Anonymous";
  const date = feedback.createdAt || feedback.date;

  return (
    <div className="p-5 bg-gray-800/50 rounded-xl border border-gray-700/50 mb-4 hover:border-gray-600/50 transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-white">{userName}</h4>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(date).toLocaleDateString("en-US", {
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
};

export default FeedbackItem;