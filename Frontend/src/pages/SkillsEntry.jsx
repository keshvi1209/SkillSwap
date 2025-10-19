import React, { useState } from "react";
import Canteach from "../components/Canteach.jsx";
import Tolearn from "../components/Tolearn.jsx";

function SkillsEntry() {
  const [activeState, setActiveState] = useState("canteach");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
      <div className="bg-[rgba(25,25,35,0.9)] rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/10">
        <div className="flex border-b border-white/10 mb-8">
          <button
            className={`flex-1 py-4 px-6 font-semibold text-lg transition-all duration-200 ${
              activeState === "canteach"
                ? "text-[#6C63FF] border-b-2 border-[#6C63FF] bg-purple-500/10"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveState("canteach")}
          >
            Can Teach
          </button>
          <button
            className={`flex-1 py-4 px-6 font-semibold text-lg transition-all duration-200 ${
              activeState === "tolearn"
                ? "text-[#6C63FF] border-b-2 border-[#6C63FF] bg-purple-500/10"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveState("tolearn")}
          >
            To Learn
          </button>
        </div>

        {activeState === "canteach" ? <Canteach /> : <Tolearn />}
      </div>
    </div>
  );
}

export default SkillsEntry;