import { useState, useEffect } from "react";
import Basicdetails from "../../components/profile/Basicdetails";
import SkillsSummary from "../../components/skills/SkillsSummary.jsx";
import styles from "./ProfilePage.module.css";
import { Star, Shield, Award, Sparkles } from "lucide-react";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import ReviewsTab from "../../components/reviews/ReviewsTab.jsx";

function ProfilePage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await api.get(`/feedback/${userId}`);
        if (response.data.success) {
          const fetchedFeedbacks = response.data.feedbacks;
          setFeedbacks(fetchedFeedbacks);

          // Calculate average rating
          if (fetchedFeedbacks.length > 0) {
            const total = fetchedFeedbacks.reduce((sum, item) => sum + item.rating, 0);
            setAverageRating(total / fetchedFeedbacks.length);
          }
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);
  return (
    <div className={`${styles.parent} min-h-screen bg-gray-950/90 relative`}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-900/90 mix-blend-multiply z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-0" />



      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Profile Management
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Manage your personal information and skills portfolio
            </p>
          </div>


        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Details & Ratings) */}
          <div className="lg:col-span-4 space-y-6">
            <Basicdetails />

            {/* Ratings Card */}
            {/* <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60 backdrop-blur-xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="text-yellow-500" size={20} />
                  Reputation
                </h3>
                <span className="px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/20">
                  TOP RATED
                </span>
              </div>

              <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl font-black text-white tracking-tighter">
                  {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
                </span>
                <div className="flex flex-col mb-1">
                  <div className="flex text-yellow-500 text-sm gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        fill="currentColor"
                        size={16}
                        className={star <= Math.round(averageRating) ? "" : "opacity-30"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 font-medium ml-0.5">
                    based on {feedbacks.length} reviews
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 w-[80%]" />
                </div>
                <p className="text-xs text-center text-gray-500">
                  You are in the top <span className="text-gray-300 font-bold">15%</span> of instructors!
                </p>
              </div>

            </div>
 */}
            {/* Reviews Section */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60 backdrop-blur-xl shadow-xl p-6">
              <ReviewsTab
                feedbacks={feedbacks}
                readOnly={true}
                showFeedbackForm={false}
              />
            </div>
          </div>

          {/* Right Column (Skills) */}
          <div className="lg:col-span-8">
            <SkillsSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
