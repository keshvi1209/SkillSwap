import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "../components/Header.jsx";

const ProficiencyBadge = ({ level }) => {
  let colorClass = "";
  switch (level) {
    case "beginner":
      colorClass = "bg-green-900 text-green-200";
      break;
    case "intermediate":
      colorClass = "bg-blue-900 text-blue-200";
      break;
    case "advanced":
      colorClass = "bg-purple-900 text-purple-200";
      break;
    default:
      colorClass = "bg-gray-700 text-gray-200";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
    >
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};

const ModeBadge = ({ mode }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      mode === "online"
        ? "bg-blue-900 text-blue-200"
        : "bg-gray-700 text-gray-200"
    }`}
  >
    {mode.charAt(0).toUpperCase() + mode.slice(1)}
  </span>
);

const StarRating = ({ rating, setRating, editable = false }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={editable ? "button" : "div"}
          onClick={() => editable && setRating(star)}
          onMouseEnter={() => editable && setRating(star)}
          className="focus:outline-none"
        >
          <svg
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-gray-400">
        {rating.toFixed(1)}/5.0
      </span>
    </div>
  );
};

const FeedbackForm = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setComment("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
    >
      <h4 className="text-lg font-semibold text-white mb-2">
        Add Your Feedback
      </h4>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Rating
        </label>
        <StarRating rating={rating} setRating={setRating} editable={true} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Share your experience with this teacher..."
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Submit Feedback
        </button>
      </div>
    </form>
  );
};

const FeedbackItem = ({ feedback }) => (
  <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 mb-3">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium text-white">{feedback.userName}</h4>
        <p className="text-xs text-gray-500">
          {new Date(feedback.date).toLocaleDateString()}
        </p>
      </div>
      <StarRating rating={feedback.rating} />
    </div>
    <p className="mt-2 text-gray-300">{feedback.comment}</p>
  </div>
);

const SkillCard = ({ skill }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition">
    <h3 className="text-lg font-semibold text-white">{skill.skill}</h3>
    <p className="text-sm text-gray-400 mt-1">{skill.description}</p>

    <div className="flex gap-2 mt-2">
      <ProficiencyBadge level={skill.proficiency} />
      <ModeBadge mode={skill.mode} />
    </div>

    <p className="text-sm text-gray-300 mt-2">
      Experience: <span className="font-medium">{skill.experience} years</span>
    </p>

    <div className="flex flex-wrap gap-2 mt-2">
      {skill.languages.map((lang, idx) => (
        <span
          key={idx}
          className="bg-gray-700 text-gray-200 px-2 py-1 rounded-lg text-xs"
        >
          {lang}
        </span>
      ))}
    </div>

    <div className="flex flex-wrap gap-2 mt-2">
      {skill.tags.map((tag, idx) => (
        <span
          key={idx}
          className="bg-indigo-900 text-indigo-200 px-2 py-1 rounded-lg text-xs"
        >
          #{tag}
        </span>
      ))}
    </div>

    {/* Availability */}
    <div className="mt-3">
      <h4 className="text-sm text-gray-400 font-semibold">Availability:</h4>
      {skill.availability.mode === "daily" && (
        <p className="text-gray-300 text-sm">
          {skill.availability.time.start} - {skill.availability.time.end}{" "}
          (Daily)
        </p>
      )}
      {skill.availability.mode === "manual" && (
        <ul className="text-gray-300 text-sm mt-1 space-y-1">
          {Object.entries(skill.availability.time).map(([day, time], idx) => (
            <li key={idx}>
              {day}: {time.start} - {time.end}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("teach");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const location = useLocation();
  const userId = location.state?.user;
  const token = localStorage.getItem("token");

  // Mock feedback data - in a real app, this would come from your backend
  const mockFeedback = [
    {
      id: 1,
      userId: 123,
      userName: "Alex Johnson",
      rating: 5,
      comment:
        "Excellent teacher! Explained complex concepts in a very understandable way.",
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
      comment:
        "Best programming instructor I've ever had. Projects were practical and relevant.",
      date: "2023-08-05",
    },
  ];

  const fetchUserDetails = async (id) => {
    try {
      const response = await api.get(`/getusercompletedetails/${id}`);

      const data = await response.json();
      setUser(data);
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
    // In a real application, you would send this to your backend
    console.log("Submitting feedback:", feedback);
    alert("Thank you for your feedback!");
    setShowFeedbackForm(false);
  };

  const calculateAverageRating = () => {
    if (!mockFeedback.length) return 0;
    const total = mockFeedback.reduce((sum, item) => sum + item.rating, 0);
    return total / mockFeedback.length;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pb-12">
      {/* Header */}
      {/* <header className="bg-gray-800 border-b border-gray-700 shadow-lg p-6 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Teacher Profile
        </h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Sign Out
        </button>
      </header> */}
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        {/* Profile Section */}
        <section className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
          <div className="relative h-4 bg-gradient-to-r from-indigo-700 to-purple-700">
  <div className="absolute -bottom-16 left-8"></div>
</div>

<div className="flex flex-col md:flex-row justify-center items-start gap-10 px-8 py-12">
  {/* Profile Image */}
  <div className="flex-shrink-0">
    <img
      src="https://via.placeholder.com/150"
      alt={user.name}
      className="h-40 w-40 rounded-full border-4 border-gray-800 bg-gray-800 shadow-xl"
    />
  </div>

  {/* Profile Details */}
  <div className="flex-1">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        {/* Name + Title */}
        <h2 className="text-3xl font-bold">{user.name}</h2>

        {/* Rating Summary */}
        <div className="flex items-center mt-4 space-x-6">
          <div className="flex items-center">
            <StarRating rating={calculateAverageRating()} />
            <span className="ml-2 text-sm text-gray-400">
              ({mockFeedback.length} reviews)
            </span>
          </div>
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-sm rounded-md transition-colors"
          >
            {showFeedbackForm ? "Cancel" : "Add Review"}
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-300">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{user.location}</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>{user.address}</span>
          </div>
        </div>
      </div>

      {/* Right Action Button */}
      <div className="mb-0 flex">
        <button className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg transition-colors flex items-center shadow-md">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          Message
        </button>
      </div>
    </div>

    {/* Feedback Form */}
    {showFeedbackForm && (
      <div className="mt-6">
        <FeedbackForm
          onSubmit={handleSubmitFeedback}
          onCancel={() => setShowFeedbackForm(false)}
        />
      </div>
    )}
  </div>
</div>

        </section>

        {/* Skills Section with Tabs */}
        <section className="mt-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
          <div className="border-b border-gray-700">
            <div className="flex">
              <button
                className={`px-6 py-4 font-medium text-sm md:text-base transition-colors ${
                  activeTab === "teach"
                    ? "text-indigo-400 border-b-2 border-indigo-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("teach")}
              >
                Skills to Teach
                <span className="ml-2 bg-gray-700 text-gray-300 text-xs py-1 px-2 rounded-full">
                  {user.canTeach ? user.canTeach.length : 0}
                </span>
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm md:text-base transition-colors ${
                  activeTab === "learn"
                    ? "text-indigo-400 border-b-2 border-indigo-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("learn")}
              >
                Skills to Learn
                <span className="ml-2 bg-gray-700 text-gray-300 text-xs py-1 px-2 rounded-full">
                  {user.toLearn ? user.toLearn.length : 0}
                </span>
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm md:text-base transition-colors ${
                  activeTab === "reviews"
                    ? "text-indigo-400 border-b-2 border-indigo-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews & Feedback
                <span className="ml-2 bg-gray-700 text-gray-300 text-xs py-1 px-2 rounded-full">
                  {mockFeedback.length}
                </span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "teach" && (
              <div>
                {user.canTeach && user.canTeach.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.canTeach.map((skill) => (
                      <SkillCard key={skill._id} skill={skill} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      ></path>
                    </svg>
                    <p className="mt-4 text-lg">No teaching skills added yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "learn" && (
              <div>
                {user.toLearn && user.toLearn.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.toLearn.map((skill) => (
                      <div
                        key={skill._id}
                        className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-indigo-500"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-white">
                            {skill.skill}
                          </h3>
                          <div className="flex gap-2">
                            <ProficiencyBadge level={skill.proficiency} />
                            <ModeBadge mode={skill.mode} />
                          </div>
                        </div>

                        {skill.languages && skill.languages.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm text-gray-400 font-semibold mb-1">
                              Languages:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {skill.languages.map((lang, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-700 text-gray-200 px-3 py-1 rounded-lg text-xs"
                                >
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {skill.tags && skill.tags.length > 0 && (
                          <div className="mt-4">
                            <div className="flex flex-wrap gap-2">
                              {skill.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="bg-indigo-900 text-indigo-200 px-3 py-1 rounded-lg text-xs"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      ></path>
                    </svg>
                    <p className="mt-4 text-lg">No learning skills added yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Student Feedback</h3>
                  <button
                    onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      ></path>
                    </svg>
                    Write a Review
                  </button>
                </div>

                {showFeedbackForm && (
                  <FeedbackForm
                    onSubmit={handleSubmitFeedback}
                    onCancel={() => setShowFeedbackForm(false)}
                  />
                )}

                {mockFeedback.length > 0 ? (
                  <div className="mt-6">
                    {mockFeedback.map((feedback) => (
                      <FeedbackItem key={feedback.id} feedback={feedback} />
                    ))}

                    {/* Pagination controls would go here */}
                    <div className="flex justify-center mt-8">
                      <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors">
                        Load More Reviews
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      ></path>
                    </svg>
                    <p className="mt-4 text-lg">No reviews yet</p>
                    <p className="mt-2">
                      Be the first to share your experience with this teacher!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDetail;
