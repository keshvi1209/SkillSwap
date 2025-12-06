import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api.js";

const ReceivedRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTeacherId(decoded.id || decoded._id);
      } catch (err) {
        console.error("Token error:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!teacherId) return;

    const fetchRequests = async () => {
      try {
        const res = await api.get(`/teacher/${teacherId}`);
        setRequests(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load booking requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [teacherId]);

  const updateRequestStatus = async (id, status) => {
    try {
      const res = await api.put(`/api/bookings/${id}/status`, { status });

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: res.data.status } : req
        )
      );

      alert(`Request ${status} successfully!`);
    } catch (err) {
      console.error(err);
      alert("Failed to update request status");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-800/50";
      case "accepted":
        return "bg-emerald-900/30 text-emerald-400 border-emerald-800/50";
      case "rejected":
        return "bg-rose-900/30 text-rose-400 border-rose-800/50";
      default:
        return "bg-gray-800/50 text-gray-300 border-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "accepted":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "📋";
    }
  };

  const handleViewDetails = (id) => navigate(`/requests/${id}`);

  const filteredRequests = requests.filter(req => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    accepted: requests.filter(r => r.status === "accepted").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-900 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading requests...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-center p-8 bg-red-900/30 border border-red-800/50 rounded-2xl backdrop-blur-xl">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-red-400 text-xl font-bold mb-2">Error Loading Requests</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-white mb-2">
                Received Requests
              </h1>
              <p className="text-gray-400 max-w-2xl">
                Manage and respond to student booking requests for your expertise
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="mt-6 lg:mt-0 flex flex-wrap gap-4">
              <StatCard 
                label="Total" 
                value={stats.total} 
                color="gray" 
              />
              <StatCard 
                label="Pending" 
                value={stats.pending} 
                color="yellow" 
              />
              <StatCard 
                label="Accepted" 
                value={stats.accepted} 
                color="emerald" 
              />
              <StatCard 
                label="Rejected" 
                value={stats.rejected} 
                color="rose" 
              />
            </div>
          </div>
        </div>
      </div>

      

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-3xl flex items-center justify-center border border-gray-700">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {filter === "all" ? "No Requests Yet" : `No ${filter} Requests`}
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {filter === "all" 
                ? "When students request your expertise, they'll appear here."
                : `You don't have any ${filter} requests at the moment.`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                className="group bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Student Info & Main Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg border border-gray-600">
                          {req.studentName?.charAt(0) || "S"}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {req.studentName}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {req.studentEmail}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusStyle(
                            req.status
                          )}`}
                        >
                          <span className="mr-1.5 mt-2">{getStatusIcon(req.status)}</span>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Requested Skill
                          </label>
                          <p className="text-white font-semibold text-lg mt-1">
                            {req.skillName}
                          </p>
                        </div>
                        
                        {req.selectedSlots?.length > 0 && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Requested Slot
                            </label>
                            <p className="text-white font-medium mt-1">
                              {req.selectedSlots[0].day}
                            </p>
                            <p className="text-gray-400">
                              {req.selectedSlots[0].startTime} – {req.selectedSlots[0].endTime}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student's Message
                        </label>
                        <p className="text-gray-300 mt-2 leading-relaxed bg-gray-900/30 rounded-xl p-4 border border-gray-700">
                          {req.message || "No additional message provided."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col gap-3 lg:w-48 shrink-0">
                    <button
                      onClick={() => handleViewDetails(req._id)}
                      className="flex-1 lg:flex-none px-4 py-3 text-gray-400 border border-gray-700 rounded-xl hover:bg-gray-700/50 hover:border-gray-600 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>👁</span>
                      <span>View Details</span>
                    </button>

                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colorClasses = {
    gray: "from-gray-700 to-gray-800 border-gray-600",
    yellow: "from-yellow-800 to-amber-900 border-yellow-700",
    emerald: "from-emerald-800 to-teal-900 border-emerald-700",
    rose: "from-rose-800 to-pink-900 border-rose-700"
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-4 min-w-[120px] text-center group hover:scale-105 transition-transform duration-200">
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg border`}>
        <span className="text-white font-bold text-lg">{value}</span>
      </div>
      <p className="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">
        {label}
      </p>
    </div>
  );
};

export default ReceivedRequests;