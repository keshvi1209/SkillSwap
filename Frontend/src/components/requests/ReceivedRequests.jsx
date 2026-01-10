import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../services/api";

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

  const stats = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      accepted: requests.filter((r) => r.status === "accepted").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    }),
    [requests]
  );

  const filteredRequests = requests.filter((req) =>
    filter === "all" ? true : req.status === filter
  );

  const handleViewDetails = (req) => {
    navigate(`/RequestDetails/${req._id}`, { state: { request: req } });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "accepted":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "rejected":
        return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getAvatarGradient = (name) => {
    const gradients = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-cyan-500 to-blue-500",
      "from-emerald-500 to-teal-500",
    ];
    return gradients[name ? name.length % gradients.length : 0];
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-500">
              Manage your incoming session requests
            </p>
          </div>

          <div className="flex gap-3">
            <StatBadge count={stats.pending} label="Pending" color="bg-amber-500" />
            <StatBadge count={stats.accepted} label="Active" color="bg-emerald-500" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
          {["all", "pending", "accepted", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-full capitalize border transition ${filter === tab
                ? "bg-white text-black border-white"
                : "bg-gray-900 text-gray-400 border-gray-800"
                }`}
            >
              {tab}
              <span className="ml-2 text-xs">
                {tab === "all" ? stats.total : stats[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Requests */}
        <div className="grid gap-4">
          {filteredRequests.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req._id}
                onClick={() => handleViewDetails(req)}
                className="group bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5
                           hover:bg-[#111] hover:border-gray-700 transition cursor-pointer"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left */}
                  <div className="flex gap-4 md:w-1/3">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                        req.studentName
                      )} flex items-center justify-center text-white font-bold`}
                    >
                      {req.studentName?.charAt(0) || "S"}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">
                        {req.studentName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {req.studentEmail}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 text-xs rounded border ${getStatusColor(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>

                  {/* Middle */}
                  <div className="flex-1 grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-6">
                    <div>
                      <p className="text-xs text-gray-500">Requested Skill</p>
                      <p className="font-medium">{req.skillName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Schedule</p>
                      {req.selectedSlots?.length ? (
                        <>
                          <p>{req.selectedSlots[0].day}</p>
                          <p className="text-xs text-gray-400">
                            {req.selectedSlots[0].startTime} -{" "}
                            {req.selectedSlots[0].endTime}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500 italic">
                          No slot selected
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Arrow */}
                  <div className="flex items-center justify-end md:w-12">
                    <div
                      onClick={(e) => {
                        e.stopPropagation(); // 🔑 FIX
                        handleViewDetails(req);
                      }}
                      className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center
                                 text-gray-400 group-hover:bg-white group-hover:text-black
                                 transition-all duration-300 transform group-hover:-rotate-45"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- Sub Components ---------- */

const StatBadge = ({ count, label, color }) => (
  <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span className="text-sm">
      <b>{count}</b> {label}
    </span>
  </div>
);

const EmptyState = ({ filter }) => (
  <div className="text-center py-24 border border-dashed border-gray-800 rounded-3xl">
    <h3 className="text-xl font-bold text-white mb-2">
      No {filter === "all" ? "" : filter} requests
    </h3>
    <p className="text-gray-500">
      Requests will appear here when available.
    </p>
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-gray-800 border-t-purple-500 rounded-full animate-spin" />
  </div>
);

const ErrorState = ({ error }) => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <p className="text-red-500">{error}</p>
  </div>
);

export default ReceivedRequests;
