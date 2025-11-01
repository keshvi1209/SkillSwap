import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AvailabilityCard from "../components/AvailabilityCard";
import { motion } from "framer-motion";
import api from "../api";

function AvailabilityPage({ onSave }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { availabilityset } = location.state || {}; // received from App.jsx

  const [currentAvailability, setCurrentAvailability] = useState([]);
  const [isSet, setIsSet] = useState(availabilityset || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (availabilityData) => {
    try {
      setLoading(true);
      setError("");

      const dataToSend = {
        ...availabilityData,
        user: availabilityData.user || localStorage.getItem("userId"),
      };

      console.log("Sending data:", dataToSend);
      const response = await api.post("/saveavailability", dataToSend);
      const result = response.data;

      setCurrentAvailability(availabilityData.availability);
      setIsSet(true); // ✅ Set availability flag true on successful save

      if (onSave) onSave(availabilityData);
    } catch (err) {
      console.error("Save failed:", err);
      setError(err.message || "Failed to save availability");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Pass back the updated flag when going back
    navigate("/app", { state: { availabilityset: isSet } });
  };

  if (loading && !currentAvailability.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-white text-lg">Loading availability...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <p className="text-red-400 text-center">{error}</p>
          </motion.div>
        )}

        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Set Your Availability
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg"
          >
            Add your available time slots for teaching
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <button
            onClick={handleBack}
            disabled={loading}
            className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 disabled:opacity-50"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
        </motion.div>

        {isSet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
          >
            <p className="text-green-400 text-center">
              ✅ Availability successfully set!
            </p>
          </motion.div>
        )}

        {currentAvailability.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
          >
            <p className="text-green-400 text-center">
              You have {currentAvailability.length} time slot
              {currentAvailability.length > 1 ? "s" : ""} set across{" "}
              {new Set(currentAvailability.map((slot) => slot.day)).size} days
            </p>
          </motion.div>
        )}

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1e1e2e] rounded-xl border border-gray-700 p-6"
          >
            <AvailabilityCard
              closeCard={handleBack}
              saveAvailability={handleSave}
              initialData={{ availability: currentAvailability }}
              isLoading={loading}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-6 bg-[#1e1e2e] rounded-xl border border-gray-700"
          >
            <h3 className="text-white font-semibold mb-4">
              Tips for setting availability:
            </h3>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-center">
                <span className="text-[#6C63FF] mr-3">•</span>
                Add multiple time slots for the same day
              </li>
              <li className="flex items-center">
                <span className="text-[#6C63FF] mr-3">•</span>
                Use "Apply same time to all days" for consistent schedule
              </li>
              <li className="flex items-center">
                <span className="text-[#6C63FF] mr-3">•</span>
                Consider your timezone and student locations
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AvailabilityPage;
