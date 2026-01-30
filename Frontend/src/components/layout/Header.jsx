import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Layers,
  Inbox,
  Calendar,
  MessageSquare,
  Clock,
  LogOut,
  User,
  Menu,
  X
} from "lucide-react";
import myimage from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "My Skills", path: "/app", icon: Layers },
    { name: "Requests", path: "/ReceivedRequests", icon: Inbox },
    { name: "Schedule", path: "/schedule-calendar", icon: Calendar },
    { name: "Chat", path: "/chat", icon: MessageSquare },
    { name: "History", path: "/sessions", icon: Clock },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="relative z-50 border-b border-white/5 bg-gray-950/50 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-md blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <img src={myimage} alt="Logo" className="h-10 w-10 relative z-10 rounded-md" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
                SkillSwap
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={`relative px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300 ${active
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                      }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/30"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <item.icon size={16} />
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-medium transition-colors border border-white/5 hover:border-indigo-500/30 group"
              >
                <div className="p-1 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 text-indigo-400 transition-colors">
                  <User size={18} />
                </div>
                <span>Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 top-[70px] z-40 bg-gray-950/95 backdrop-blur-xl md:hidden"
        >
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${isActive(item.path)
                    ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                    : "bg-gray-900 border-white/5 text-gray-400 hover:bg-gray-800"
                    }`}
                >
                  <item.icon size={24} className="mb-2" />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  navigate("/profile");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gray-800 rounded-xl text-white font-medium"
              >
                <User size={20} /> My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 p-4 bg-red-500/10 text-red-400 rounded-xl font-medium"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default Header;
