import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, Sparkles } from "lucide-react";
import Header from "./components/layout/Header";
import SkillsEntry from "./pages/skills/SkillsEntry";
import { useAuth } from "./context/AuthContext";

function App() {
  const navigate = useNavigate();
  const [availabilityset, setAvailabilityset] = useState(false);

  const handleNavigate = () => {
    navigate("/availability", { state: { availabilityset } });
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-x-hidden selection:bg-indigo-500/30 font-sans text-gray-200">

      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <Header />

      <main className="relative z-10 pt-12 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl"
        >
         

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Elevate Skills</span> or <br className="hidden md:block" /> Share Expertise?
          </h1>

        </motion.div>

        {/* Availability Action Card */}
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
                <h3 className="text-xl font-bold text-white">Manage Availability</h3>
                <p className="text-gray-400 text-sm">Set your schedule to receive booking requests.</p>
              </div>
            </div>

            <button
              onClick={handleNavigate}
              disabled={availabilityset}
              className={`px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${availabilityset
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25 hover:-translate-y-0.5"
                }`}
            >
              {availabilityset ? "Availability Set" : "Set Availability"}
            </button>
          </div>
        </motion.div>

        {/* Skills Entry Form */}
        <SkillsEntry />
      </main>
    </div>
  );
}

export default App;
