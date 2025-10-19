import React from "react";
import Signup from "../components/Signup";

const myimage = "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

function Signuppage() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center antialiased relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
      </div>

      {/* Main card container with glass morphism effect */}
      <div className="flex w-full max-w-6xl h-[90vh] max-h-[850px] rounded-2xl shadow-2xl overflow-hidden bg-gray-800/70 backdrop-blur-xl border border-gray-700/50 relative z-10 mx-4">
  
        {/* Left Container - Signup Form */}
        <div className="w-full lg:w-1/2 p-6 md:p-8 flex items-center justify-center overflow-hidden">
          <div className="w-full max-w-md">
            {/* Header for mobile */}
            <div className="lg:hidden text-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  SkillHub
                </span>
              </h1>
              <p className="text-gray-400">Connect with mentors worldwide</p>
            </div>
            <Signup />
          </div>
        </div>

        {/* Right Container - Visual Banner */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-black p-6 items-center justify-center relative overflow-hidden">
          
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-indigo-900/30"></div>
          
          {/* Animated floating elements */}
          <div className="absolute top-20 right-20 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
          
          <img 
            src={myimage}
            alt="Learning and Connection Visual" 
            className="w-full h-full object-cover rounded-xl shadow-2xl opacity-80 transition-all duration-700 hover:opacity-90 scale-105"
          />
          
          {/* Enhanced promotional text overlay */}
          <div className="absolute bottom-5 left-5 right-5 p-5 bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl">
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-bold text-white">
                Start Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 ml-2">
                  Journey
                </span>
              </h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Join thousands of learners and mentors building skills together. Get personalized 
              guidance and accelerate your professional growth.
            </p>
            <div className="flex items-center mt-3 pt-3 border-t border-gray-700/50">
              <div className="flex -space-x-2 mr-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-900"></div>
                <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-900"></div>
                <div className="w-6 h-6 bg-indigo-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <span className="text-xs text-gray-400">Join 10k+ learners worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
        <p className="text-gray-500 text-xs">Secure • Reliable • Community Driven</p>
      </div>
    </div>
  );
}

export default Signuppage;