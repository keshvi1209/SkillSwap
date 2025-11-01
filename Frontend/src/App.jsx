import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import SkillsEntry from "./pages/SkillsEntry";
import AvailabilityPage from "./pages/AvailabilityPage";
import { motion } from "framer-motion";
import Welcomesection from "./components/Welcomesection";
import { useAuth } from "./context/AuthContext";

function App() {
  const navigate = useNavigate();
  const [availabilityset, setAvailabilityset] = useState(false);

  const handleNavigate = () => {
    navigate("/availability", { state: { availabilityset } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Background visuals */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-gradient-to-br from-purple-500/15 to-indigo-700/15 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-[15%] right-[10%] w-48 h-48 bg-gradient-to-br from-purple-500/12 to-indigo-700/12 rounded-full blur-lg animate-float"></div>
        <div className="absolute top-1/2 left-[70%] w-36 h-36 bg-gradient-to-br from-purple-500/10 to-indigo-700/10 rounded-full blur-md animate-rotate"></div>
        <div className="absolute bottom-[5%] left-[20%] w-60 h-60 bg-gradient-to-br from-purple-500/12 to-indigo-700/12 rounded-full blur-lg animate-pulse-slow delay-1000"></div>
      </div>

      <Header />

      <Welcomesection>
        <h2 className="text-xl md:text-2xl text-gray-300 text-center leading-relaxed relative z-10">
          Ready to elevate your skills or share your expertise?
          <br />
          Let's get your skill listed!
        </h2>
      </Welcomesection>

      <div className="container mx-auto px-4 pt-4 relative z-10">
        <div className="flex justify-center mb-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={handleNavigate}
              disabled={availabilityset}
              className={`px-8 py-4 font-semibold rounded-xl transition-all duration-200 text-lg 
                ${
                  availabilityset
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#6C63FF] to-[#4a3fdb] text-white hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
                }`}
            >
              {availabilityset ? "Availability Already Set" : "Set Your Availability"}
            </button>
          </motion.div>
        </div>

      </div>

      <SkillsEntry />
    </div>
  );
}

export default App;
