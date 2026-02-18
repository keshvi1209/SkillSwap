import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Better active route detection (supports nested routes)
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-gray-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <img
              src={myimage}
              alt="Logo"
              className="h-9 w-9 rounded-md"
            />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              SkillSwap
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`relative px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition ${active
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                    }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-indigo-600 rounded-full"
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

          {/* Right Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm"
            >
              <User size={16} />
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Push content below fixed header */}
      <div className="h-16" />

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 bottom-0 bg-gray-950/95 backdrop-blur-xl z-40 lg:hidden overflow-y-auto"
          >
            <div className="p-6 space-y-6">

              {/* Nav Items */}
              <div className="grid grid-cols-2 gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition ${isActive(item.path)
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                        : "bg-gray-900 border-white/10 text-gray-400"
                      }`}
                  >
                    <item.icon size={24} className="mb-2" />
                    <span className="text-sm font-medium">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Profile + Logout */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-gray-800 rounded-xl text-white"
                >
                  <User size={18} />
                  My Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-red-500/10 text-red-400 rounded-xl"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
