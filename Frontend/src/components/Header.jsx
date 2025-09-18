import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import myimage from "../assets/logo.png";
import { useAuth } from "../context/AuthContext"; // ✅ import context

function Header() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // ✅ from AuthContext

  const features = [
    "Add Skills",
    "Search Best Fit",
    "Scheduled Meetings",
    "Chat",
    "Past Sessions",
  ];
  const [active, setActive] = useState("Add Skills");

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    setUser(null); // clear user from context
    navigate("/login"); // redirect
  };

  return (
    <div className="flex items-center justify-between p-4 bg-[#1a1a2e] border-b border-[#16213e] shadow-lg">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={myimage} alt="Logo" className="h-10 mr-3" />
        <h1 className="text-2xl font-bold text-white">SkillSwap</h1>
      </div>

      {/* Features */}
      <nav className="flex items-center space-x-8">
        {features.map((item) => (
          <div
            key={item}
            className="relative cursor-pointer py-2 text-gray-400 hover:text-white transition-colors duration-200"
            onClick={() => setActive(item)}
          >
            <span className="font-medium">{item}</span>
            {active === item && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C63FF]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        ))}
      </nav>

      {/* Profile + Logout */}
      <div className="flex items-center space-x-4">
        <button
          className="px-6 py-2 bg-gradient-to-r from-[#6C63FF] to-[#4a3fdb] text-white font-semibold rounded-full shadow-md hover:from-[#4a3fdb] hover:to-[#6C63FF] transition-all duration-300 transform hover:scale-105"
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>
        <button
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;
