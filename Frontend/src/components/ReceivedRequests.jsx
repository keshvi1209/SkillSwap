import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ReceivedRequests = () => {
  const navigate = useNavigate();

  const [requests] = useState([
    {
      id: 1,
      username: "john_doe",
      sender: "John Doe",
      skill: "Python Tutoring",
      date: "2025-10-23",
      timeSlot: "2:00 PM - 4:00 PM",
      day: "Saturday",
      message: "I'd like to learn Python basics this weekend. Specifically interested in data structures and basic algorithms.",
      status: "pending",
      avatar: "JD"
    },
    {
      id: 2,
      username: "sarah_lee",
      sender: "Sarah Lee",
      skill: "Web Development",
      date: "2025-10-22",
      timeSlot: "10:00 AM - 12:00 PM",
      day: "Friday",
      message: "Need a session on React fundamentals including hooks and state management.",
      status: "pending",
      avatar: "SL"
    },
    {
      id: 3,
      username: "mike_chen",
      sender: "Mike Chen",
      skill: "Graphic Design",
      date: "2025-10-24",
      timeSlot: "3:00 PM - 5:00 PM",
      day: "Sunday",
      message: "Looking to learn Adobe Illustrator basics for creating logos.",
      status: "accepted",
      avatar: "MC"
    }
  ]);

  const handleViewDetails = (id) => {
    navigate(`/requests/${id}`);
  };

  const handleQuickChat = (e, username) => {
    e.stopPropagation();
    alert(`Opening chat with ${username}`);
  };

  const handleQuickAccept = (e, id) => {
    e.stopPropagation();
    // In real app, you would update the request status here
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: "accepted" } : req
    );
    alert(`Request ${id} accepted!`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-900/30 text-yellow-300 border-yellow-700";
      case "accepted": return "bg-green-900/30 text-green-300 border-green-700";
      case "rejected": return "bg-red-900/30 text-red-300 border-red-700";
      default: return "bg-gray-800 text-gray-300 border-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Received Requests</h1>
          <p className="text-gray-400 mt-2">Manage your incoming skill exchange requests</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
            <div className="text-2xl font-bold text-white">{requests.length}</div>
            <div className="text-gray-400 text-sm">Total Requests</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
            <div className="text-2xl font-bold text-yellow-400">
              {requests.filter(req => req.status === "pending").length}
            </div>
            <div className="text-gray-400 text-sm">Pending</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
            <div className="text-2xl font-bold text-green-400">
              {requests.filter(req => req.status === "accepted").length}
            </div>
            <div className="text-gray-400 text-sm">Accepted</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
            <div className="text-2xl font-bold text-blue-400">
              {requests.filter(req => req.status === "pending").length}
            </div>
            <div className="text-gray-400 text-sm">Need Action</div>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden hover:border-gray-600"
            >
              <div className="p-6">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {req.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{req.sender}</h3>
                      <p className="text-gray-400 text-sm">@{req.username}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                  {/* Skill and Message */}
                  <div className="lg:col-span-2">
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-400">Requested Skill</span>
                      <h4 className="text-xl font-bold text-blue-400">{req.skill}</h4>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400">Message</span>
                      <p className="text-gray-300 mt-1 line-clamp-2">{req.message}</p>
                    </div>
                  </div>

                  {/* Time Details */}
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-400">Day</span>
                        <p className="font-semibold text-white">{req.day}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-400">Date</span>
                        <p className="font-semibold text-white">{req.date}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-400">Time Slot</span>
                        <p className="font-semibold text-white">{req.timeSlot}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <button
                    onClick={(e) => handleQuickChat(e, req.username)}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors px-4 py-2 rounded-lg hover:bg-blue-900/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewDetails(req.id)}
                      className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium hover:border-gray-500 hover:text-white"
                    >
                      View Details
                    </button>
                    
                    {req.status === "pending" && (
                      <button
                        onClick={(e) => handleQuickAccept(e, req.id)}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Accept Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No requests yet</h3>
            <p className="text-gray-400">When someone sends you a skill exchange request, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceivedRequests;