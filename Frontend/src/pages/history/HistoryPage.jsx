import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Video, CheckCircle, ArrowRight, Filter, AlertCircle } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // 'all', 'upcoming', 'past'

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get("/meet/my-calendar");
                setMeetings(res.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [user]);

    const now = new Date();

    const getStatus = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (now > end) return "completed";
        if (now >= start && now <= end) return "ongoing";
        return "upcoming";
    };

    const filteredMeetings = meetings.filter((meeting) => {
        const status = getStatus(meeting.startTime, meeting.endTime);
        if (filter === "upcoming") return status === "upcoming" || status === "ongoing";
        if (filter === "past") return status === "completed";
        return true;
    }).sort((a, b) => {
        // Sort upcoming ascending, past descending
        if (filter === "past") {
            return new Date(b.startTime) - new Date(a.startTime);
        }
        return new Date(a.startTime) - new Date(b.startTime);
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Session History</h1>
                        <p className="text-gray-400">Track your learning journey and teaching sessions</p>
                    </div>

                    <div className="flex bg-gray-900/50 p-1 rounded-xl border border-white/10 backdrop-blur-sm self-start md:self-auto">
                        {["all", "upcoming", "past"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-300 ${filter === f
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {meetings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-gray-900/30 rounded-3xl border border-white/5"
                    >
                        <div className="bg-gray-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="text-gray-500" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No sessions found</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-6">
                            You haven't scheduled any sessions yet. Connect with others to start learning or teaching!
                        </p>
                        <button
                            onClick={() => navigate('/learn')}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all"
                        >
                            Find Skills to Learn
                        </button>
                    </motion.div>
                ) : filteredMeetings.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p>No {filter} sessions found.</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-4"
                    >
                        {filteredMeetings.map((meet) => {
                            const isTeacher = meet.teacherId?._id === user?.id;
                            const otherParty = isTeacher ? meet.studentId : meet.teacherId;
                            const status = getStatus(meet.startTime, meet.endTime);
                            const isPast = status === "completed";

                            return (
                                <motion.div
                                    key={meet._id}
                                    variants={itemVariants}
                                    className={`relative overflow-hidden group rounded-2xl border transition-all duration-300 ${isPast
                                            ? "bg-gray-900/40 border-white/5 hover:border-white/10"
                                            : "bg-gray-900/80 border-indigo-500/30 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10"
                                        }`}
                                >
                                    {/* Status Indicator Bar */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${status === 'completed' ? 'bg-gray-700' :
                                            status === 'ongoing' ? 'bg-green-500 animate-pulse' :
                                                'bg-indigo-500'
                                        }`} />

                                    <div className="p-5 pl-7 flex flex-col md:flex-row gap-6 md:items-center justify-between">

                                        {/* Main Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${isTeacher
                                                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                    }`}>
                                                    {isTeacher ? "Teaching" : "Learning"}
                                                </span>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${status === 'completed' ? "bg-gray-800 text-gray-400" :
                                                        status === 'ongoing' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                                                            "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                                    }`}>
                                                    {status}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                                                {meet.skillName}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-gray-500" />
                                                    {new Date(meet.startTime).toLocaleDateString(undefined, {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} className="text-gray-500" />
                                                    {new Date(meet.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                    {" - "}
                                                    {new Date(meet.endTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <User size={14} className="text-gray-500" />
                                                    {otherParty?.name || "Unknown User"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3">
                                            {meet.meetLink && !isPast && (
                                                <a
                                                    href={meet.meetLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5"
                                                >
                                                    <Video size={18} />
                                                    Join Meeting
                                                </a>
                                            )}

                                            {isPast && (
                                                <div className="flex items-center gap-2 text-gray-500 px-4">
                                                    <CheckCircle size={18} />
                                                    <span>Completed</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
