import React from "react";
import Header from "./components/Header";
import SkillsEntry from "./pages/SkillsEntry";
import { motion } from "framer-motion";
import Welcomesection from "./components/Welcomesection";
import { useAuth } from "./context/AuthContext";

function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-gradient-to-br from-purple-500/15 to-indigo-700/15 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-[15%] right-[10%] w-48 h-48 bg-gradient-to-br from-purple-500/12 to-indigo-700/12 rounded-full blur-lg animate-float"></div>
        <div className="absolute top-1/2 left-[70%] w-36 h-36 bg-gradient-to-br from-purple-500/10 to-indigo-700/10 rounded-full blur-md animate-rotate"></div>
        <div className="absolute bottom-[5%] left-[20%] w-60 h-60 bg-gradient-to-br from-purple-500/12 to-indigo-700/12 rounded-full blur-lg animate-pulse-slow delay-1000"></div>
        
        <div className="absolute top-[15%] right-[15%] w-24 h-24 bg-gradient-to-br from-purple-500/10 to-indigo-700/10 clip-path-diamond animate-float delay-500"></div>
        <div className="absolute bottom-[20%] left-[15%] w-20 h-20 bg-gradient-to-br from-purple-500/8 to-indigo-700/8 clip-path-pentagon animate-move"></div>
        <div className="absolute top-[70%] right-[25%] w-28 h-28 bg-gradient-to-br from-purple-500/6 to-indigo-700/6 clip-path-hexagon animate-rotate-slow"></div>
        
        <div className="absolute top-[30%] left-[10%] w-5 h-5 bg-purple-500/20 rounded-full animate-drift"></div>
        <div className="absolute top-[60%] left-[80%] w-4 h-4 bg-indigo-700/15 rounded-full animate-drift-reverse"></div>
        <div className="absolute top-[20%] left-[40%] w-6 h-6 bg-purple-500/15 rounded-full animate-drift-delay"></div>
      </div>

      <Header />
      <Welcomesection>
       

        <h2 className="text-xl md:text-2xl text-gray-300 text-center leading-relaxed relative z-10">
          Ready to elevate your skills or share your expertise?
          <br />
          Let's get your skill listed!
        </h2>
      </Welcomesection>

      <SkillsEntry />
    </div>
  );
}

export default App;