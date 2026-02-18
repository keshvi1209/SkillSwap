import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  AlertCircle,
  Inbox,
  BookOpen,
} from "lucide-react";
import api from "../../services/api";
import Header from "../layout/Header";

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
    [requests],
  );

  const filteredRequests = requests.filter((req) =>
    filter === "all" ? true : req.status === filter,
  );

  const handleViewDetails = (req) => {
    navigate(`/RequestDetails/${req._id}`, { state: { request: req } });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "accepted":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "rejected":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  // if (loading) return <LoadingState />;
  // if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-x-hidden selection:bg-indigo-500/30 font-sans text-gray-200">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <Header />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : (
        <>
          <div className="relative z-10 pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Requests
                </h1>
                <p className="text-gray-400 mt-2 text-lg">
                  Manage and track your incoming session requests
                </p>
              </div>

              <div className="flex gap-3">
                <StatBadge
                  count={stats.pending}
                  label="Pending"
                  color="bg-amber-500"
                />
                <StatBadge
                  count={stats.accepted}
                  label="Active"
                  color="bg-emerald-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-6">
              {["all", "pending", "accepted", "rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-5 py-2.5 rounded-full capitalize border transition-all duration-300 text-sm font-medium ${
                    filter === tab
                      ? "bg-white text-gray-950 border-white shadow-lg shadow-white/10"
                      : "bg-gray-900/50 text-gray-400 border-white/5 hover:bg-gray-800 hover:text-gray-200"
                  }`}
                >
                  {tab}
                  <span
                    className={`ml-2 text-xs py-0.5 px-2 rounded-full ${filter === tab ? "bg-gray-950/20 text-gray-900" : "bg-gray-800 text-gray-500"}`}
                  >
                    {tab === "all" ? stats.total : stats[tab]}
                  </span>
                </button>
              ))}
            </div>

            {/* Requests List */}
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {filteredRequests.length === 0 ? (
                  <EmptyState filter={filter} />
                ) : (
                  filteredRequests.map((req, index) => (
                    <motion.div
                      key={req._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => handleViewDetails(req)}
                      className="group bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6
                             hover:bg-gray-800/80 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-indigo-500/10 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                        {/* Left: User Info */}
                        <div className="flex gap-4 md:w-1/3 items-center">
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20 ring-2 ring-white/10`}
                          >
                            {req.studentName?.charAt(0) || "S"}
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {req.studentName}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                              <User size={12} /> {req.studentEmail}
                            </p>
                            <span
                              className={`inline-block mt-2 px-2.5 py-1 text-xs font-semibold rounded-lg border ${getStatusColor(
                                req.status,
                              )}`}
                            >
                              {req.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Middle: Details */}
                        <div className="flex-1 grid grid-cols-2 gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <BookOpen size={12} /> Requested Skill
                            </p>
                            <p className="font-semibold text-gray-200">
                              {req.skillName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <Calendar size={12} /> Schedule
                            </p>
                            {req.selectedSlots?.length ? (
                              <>
                                <p className="font-medium text-gray-200">
                                  {req.selectedSlots[0].day}
                                </p>
                                <p className="text-xs text-indigo-400 font-mono mt-0.5 flex items-center gap-1">
                                  <Clock size={10} />
                                  {req.selectedSlots[0].startTime} -{" "}
                                  {req.selectedSlots[0].endTime}
                                </p>
                              </>
                            ) : (
                              <p className="text-gray-500 italic text-sm">
                                No slot selected
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right: Action */}
                        <div className="flex items-center justify-end md:w-16 self-end md:self-center">
                          <div
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center
                                   text-gray-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500
                                   transition-all duration-300 transform group-hover:-rotate-45 shadow-lg"
                          >
                            <ArrowRight size={18} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ---------- Sub Components ---------- */

const StatBadge = ({ count, label, color }) => (
  <div className="flex items-center gap-2 bg-gray-900/60 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
    <div
      className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`}
    />
    <span className="text-sm text-gray-300">
      <b className="text-white">{count}</b> {label}
    </span>
  </div>
);

const EmptyState = ({ filter }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-gray-900/20 flex flex-col items-center justify-center"
  >
    <div className="p-4 bg-gray-800/50 rounded-full mb-4">
      <Filter size={32} className="text-gray-600" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2 capitalize">
      No {filter === "all" ? "" : filter} requests
    </h3>
    <p className="text-gray-500 max-w-sm mx-auto">
      Requests will appear here when students book a session with you.
    </p>
  </motion.div>
);

const LoadingState = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20" />
    <div className="relative flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-indigo-400 font-medium animate-pulse">
        Loading Dashboard...
      </p>
    </div>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-3xl backdrop-blur-md">
      <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">
        Something went wrong
      </h3>
      <p className="text-red-400 mb-6">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ReceivedRequests;
