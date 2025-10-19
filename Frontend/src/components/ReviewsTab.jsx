import FeedbackForm from "./FeedbackForm";
import FeedbackItem from "./FeedbackItem";
import EmptyState from "./EmptyState";

const ReviewsTab = ({ 
  feedbacks, 
  showFeedbackForm, 
  onToggleFeedbackForm, 
  onSubmitFeedback 
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Student Reviews</h3>
          <p className="text-sm text-gray-400 mt-1">See what students are saying</p>
        </div>
        <button
          onClick={onToggleFeedbackForm}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg transition-all font-medium shadow-lg shadow-indigo-500/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Write Review
        </button>
      </div>

      {showFeedbackForm && (
        <FeedbackForm
          onSubmit={onSubmitFeedback}
          onCancel={onToggleFeedbackForm}
        />
      )}

      {feedbacks.length > 0 ? (
        <div className="mt-6">
          {feedbacks.map((feedback) => (
            <FeedbackItem key={feedback.id} feedback={feedback} />
          ))}

          <div className="flex justify-center mt-8">
            <button className="px-6 py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-all font-medium border border-gray-600/30">
              Load More Reviews
            </button>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
          title="No reviews yet"
          description="Be the first to share your experience!"
        />
      )}
    </div>
  );
};

export default ReviewsTab;