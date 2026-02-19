import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import Header from "./components/layout/Header";
import SkillsEntry from "./pages/skills/SkillsEntry";
import { useAuth } from "./context/AuthContext";
import api from "./services/api";

function App() {
  const navigate = useNavigate();
  const userid = localStorage.userid;

  const [availabilitySet, setAvailabilitySet] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleNavigate = () => {
    if (availabilitySet) {
      navigate("/availability?mode=edit");
    } else {
      navigate("/availability?mode=create");
    }
  };

  useEffect(() => {
    const checkAvailability = async () => {
      if (!userid) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/getavailability/${userid}`);

        // If we reach here, it's 200
        setAvailabilitySet(true);
      } catch (error) {
        if (error.response?.status === 404) {
          // Availability not set
          setAvailabilitySet(false);
        } else {
          console.error("Error checking availability:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAvailability();
  }, [userid]);

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-x-hidden selection:bg-indigo-500/30 font-sans text-gray-200">
      <Header />

      <main className="relative z-10 pt-12 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Elevate Skills
            </span>{" "}
            or Share Expertise?
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full max-w-4xl mb-10"
        >
          <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                <CalendarCheck size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Manage Availability
                </h3>
                <p className="text-gray-400 text-sm">
                  Set your schedule to receive booking requests.
                </p>
              </div>
            </div>

            {loading ? (
              <button
                disabled
                className="px-6 py-3 rounded-xl font-semibold bg-gray-800 text-gray-400 cursor-not-allowed"
              >
                Checking...
              </button>
            ) : availabilitySet ? (
              <div className="flex items-center gap-3">
                {/* Status Pill */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">
                  <CalendarCheck size={16} />
                  Availability Set
                </div>

                {/* Edit Button */}
                <button
                  onClick={handleNavigate}
                  className="px-5 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Edit
                </button>
              </div>
            ) : (
              <button
                onClick={handleNavigate}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:-translate-y-0.5 transition-all duration-300"
              >
                Set Availability
              </button>
            )}
          </div>
        </motion.div>

        <SkillsEntry />
      </main>
    </div>
  );
}

export default App;
