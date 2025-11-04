import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState("");

  const [request] = useState({
    id,
    username: "john_doe",
    sender: "John Doe",
    skill: "Python Tutoring",
    date: "2025-10-23",
    timeSlot: "2:00 PM - 4:00 PM",
    day: "Saturday",
    message: "I'd like to learn Python basics this weekend. Specifically interested in data structures and basic algorithms. I have some programming experience but new to Python.",
    status: "pending"
  });

  const availableSkills = [
    "Python Basics",
    "Advanced Python",
    "Data Science with Python",
    "Web Development with Django",
    "Automation with Python"
  ];

  const handleCreateMeeting = () => {
    if (!selectedSkill) {
      alert("Please select a skill to teach first!");
      return;
    }
    alert(`Meeting created for ${selectedSkill} successfully!`);
  };

  const handleAccept = () => {
    if (!selectedSkill) {
      alert("Please select a skill to teach before accepting!");
      return;
    }
    alert(`Request accepted! You'll be teaching ${selectedSkill}`);
    navigate("/requests");
  };

  const handleStartChat = () => {
    alert(`Opening chat with ${request.username}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors font-medium"
        onClick={() => navigate("/requests")}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Requests
      </button>

      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {request.skill}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="font-semibold">{request.sender}</span>
              <span className="text-gray-400">•</span>
              <span>@{request.username}</span>
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                {request.status}
              </span>
            </div>
          </div>
        </div>

        {/* Time and Date Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4 bg-blue-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600">Day</p>
            <p className="text-lg font-bold text-gray-800">{request.day}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600">Date</p>
            <p className="text-lg font-bold text-gray-800">{request.date}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600">Time Slot</p>
            <p className="text-lg font-bold text-gray-800">{request.timeSlot}</p>
          </div>
        </div>

        {/* Message Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Message from {request.sender}</h3>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700 leading-relaxed">{request.message}</p>
          </div>
        </div>

        {/* Skill Selection Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Select Skill You Want to Teach
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableSkills.map((skill, index) => (
              <button
                key={index}
                onClick={() => setSelectedSkill(skill)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedSkill === skill
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          {selectedSkill && (
            <p className="mt-3 text-green-600 font-medium">
              Selected: {selectedSkill}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={handleStartChat}
            className="flex items-center gap-3 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Start Chat
          </button>

          <div className="flex gap-4">
            <button
              onClick={handleCreateMeeting}
              disabled={!selectedSkill}
              className={`px-8 py-3 rounded-xl font-semibold transition-colors ${
                selectedSkill
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Create Meeting
            </button>

            <button
              onClick={handleAccept}
              disabled={!selectedSkill}
              className={`px-8 py-3 rounded-xl font-semibold transition-colors ${
                selectedSkill
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Accept Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;