import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  BookOpen,
  GraduationCap,
  UserPlus,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Header from "../../components/layout/Header";
import StarRating from "../../components/common/StarRating";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const token = localStorage.getItem("token");
  const decodedtoken = token ? jwtDecode(token) : null;
  const currentUserId = decodedtoken ? decodedtoken.id : null;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recRes = await api.get(`/recommendations/${currentUserId}`);
        const recData = recRes.data;
        const ids = recData.recommendations;

        if (!ids || ids.length === 0) {
          setRecommendations([]);
          return;
        }

        const detailsPromises = ids.map(async (id) => {
          try {
            const res = await api.get(`/getdetails/${id}`);
            return res.data;
          } catch (err) {
            console.error(`Failed to fetch details for user ${id}`, err);
            return null;
          }
        });

        const users = (await Promise.all(detailsPromises)).filter(Boolean);
        setRecommendations(users);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [currentUserId, token]);

  const filteredData = recommendations.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.canTeach?.some((skill) =>
        skill.toLowerCase().includes(search.toLowerCase())
      ) ||
      item.toLearn?.some((skill) =>
        skill.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-x-hidden text-gray-200 selection:bg-indigo-500/30">

      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <Sparkles size={16} className="text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">Welcome back, {user?.name || "Explorer"}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Discover Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Learning Journey
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
            Connect with skilled mentors and curious learners in a vibrant community.
            Exchange knowledge, master new skills, and grow together.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto w-full group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-30 group-hover:opacity-60 blur transition duration-500" />
            <div className="relative flex items-center bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
              <div className="pl-6 text-gray-500">
                <Search size={22} />
              </div>
              <input
                type="text"
                placeholder="Search for mentors, skills, or topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-5 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none"
              />
              <button className="hidden sm:flex items-center gap-2 mr-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg active:scale-95">
                Search
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recommendations Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-1 h-8 bg-indigo-500 rounded-full" />
            Recommended Connections
          </h2>
          <span className="text-sm text-gray-400 hidden sm:block">
            Based on your interests and skills
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-96 rounded-3xl bg-gray-800/20 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((item, index) => (
              <motion.div
                key={item.userId || item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate("/userdetail", { state: { user: item.userId || item._id } })}
                className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                {/* Cover Gradient */}
                <div className="h-24 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 group-hover:from-indigo-800/50 group-hover:to-purple-800/50 transition-colors" />

                <div className="px-6 pb-6">
                  {/* Avatar */}
                  <div className="relative -mt-12 mb-4">
                    <div className="w-24 h-24 rounded-2xl bg-gray-800 p-1 border-4 border-gray-900 shadow-xl overflow-hidden">
                      <img
                        src={item.image || `https://api.dicebear.com/7.x/initials/svg?seed=${item.name}`}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    {item.rating && (
                      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-gray-900 border border-gray-700 rounded-xl px-2 py-1 flex items-center gap-1 shadow-lg">
                        <span className="text-xs font-bold text-white">{item.rating?.toFixed(1) || "5.0"}</span>
                        <StarRating rating={item.rating || 5} setRating={() => { }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin size={14} className="mr-1 text-gray-400" />
                      {item.city || "Remote"}
                    </div>
                  </div>

                  {/* Skills Chips */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <GraduationCap size={12} className="text-indigo-400" /> Can Teach
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.canTeach?.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {typeof skill === 'string' ? skill : skill.skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <BookOpen size={12} className="text-purple-400" /> Wants to Learn
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.toLearn?.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {typeof skill === 'string' ? skill : skill.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-white/5">
                    <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white">
                      View Profile <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-gray-800 rounded-3xl bg-gray-900/50">
            <div className="p-4 rounded-full bg-gray-800 mb-4">
              <UserPlus size={32} className="text-gray-500 opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No recommendations found</h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any matches right now. Try updating your skills or search for something specific.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}