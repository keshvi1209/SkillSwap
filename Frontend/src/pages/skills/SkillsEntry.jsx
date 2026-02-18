import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, GraduationCap } from "lucide-react";
import Canteach from "../../components/skills/Canteach.jsx";
import Tolearn from "../../components/skills/Tolearn.jsx";

function SkillsEntry() {
  const [activeState, setActiveState] = useState("canteach");

  const tabs = [
    { id: "canteach", label: "Can Teach", icon: GraduationCap },
    { id: "tolearn", label: "To Learn", icon: BookOpen },
  ];

  return (
    <div className="container mx-auto py-6 max-w-4xl relative z-10">
      <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        {/* Tabs Header */}
        <div className="flex border-b border-white/10 bg-black/20">
          {tabs.map((tab) => {
            const isActive = activeState === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveState(tab.id)}
                className={`relative flex-1 py-5 px-6 flex items-center justify-center gap-3 text-lg font-medium transition-colors duration-300 ${isActive ? "text-white" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-skill-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                <tab.icon
                  size={22}
                  className={`transition-colors duration-300 ${isActive ? "text-indigo-400" : "text-gray-500"}`}
                />
                <span className="relative z-10">{tab.label}</span>

                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-50" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeState === "canteach" ? <Canteach /> : <Tolearn />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default SkillsEntry;