import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "../components/Header.jsx";
import api from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import ProfileHeader from "../components/ProfileHeader";
import TabNavigation from "../components/TabNavigation";
import TeachTab from "../components/TeachTab";
import LearnTab from "../components/LearnTab";
import ReviewsTab from "../components/ReviewsTab";

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("teach");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const location = useLocation();
  const userId = location.state?.user;
  const token = localStorage.getItem("token");

  const mockFeedback = [
    {
      id: 1,
      userId: 123,
      userName: "Alex Johnson",
      rating: 5,
      comment: "Excellent teacher! Explained complex concepts in a very understandable way.",
      date: "2023-10-15",
    },
    {
      id: 2,
      userId: 124,
      userName: "Maria Garcia",
      rating: 4,
      comment: "Very knowledgeable and patient. Would recommend to others.",
      date: "2023-09-22",
    },
    {
      id: 3,
      userId: 125,
      userName: "David Kim",
      rating: 5,
      comment: "Best programming instructor I've ever had. Projects were practical and relevant.",
      date: "2023-08-05",
    },
  ];

  const fetchUserDetails = async (id) => {
    try {
      const response = await api.get(`/getusercompletedetails/${id}`);
      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    } else if (token) {
      const decoded = jwtDecode(token);
      fetchUserDetails(decoded.id);
    }
  }, [userId, token]);

  const handleSubmitFeedback = (feedback) => {
    console.log("Submitting feedback:", feedback);
    alert("Thank you for your feedback!");
    setShowFeedbackForm(false);
  };


  const calculateAverageRating = () => {
    if (!mockFeedback.length) return 0;
    const total = mockFeedback.reduce((sum, item) => sum + item.rating, 0);
    return total / mockFeedback.length;
  };

  const handleMessageClick = () => {
    console.log("Message button clicked");
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-16">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <ProfileHeader
          user={user}
          averageRating={calculateAverageRating()}
          reviewCount={mockFeedback.length}
          onMessageClick={handleMessageClick}
        />

        <section className="mt-8 bg-gradient-to-br from-gray-800/80 to-gray-800/50 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden backdrop-blur-sm">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            teachCount={user.canTeach ? user.canTeach.length : 0}
            learnCount={user.toLearn ? user.toLearn.length : 0}
            reviewCount={mockFeedback.length}
          />

          <div className="p-6 sm:p-8">
            {activeTab === "teach" && (
              <TeachTab 
                skills={user.canTeach} 
                userId={userId} 
              />
            )}

            {activeTab === "learn" && (
              <LearnTab skills={user.toLearn} />
            )}

            {activeTab === "reviews" && (
              <ReviewsTab
                feedbacks={mockFeedback}
                showFeedbackForm={showFeedbackForm}
                onToggleFeedbackForm={() => setShowFeedbackForm(!showFeedbackForm)}
                onSubmitFeedback={handleSubmitFeedback}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDetail;