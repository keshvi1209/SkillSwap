import { motion } from "framer-motion";

const TabNavigation = ({ activeTab, onTabChange, teachCount, learnCount, reviewCount }) => {
  const tabs = [
    { id: "teach", label: "Skills to Teach", count: teachCount },
    { id: "learn", label: "Skills to Learn", count: learnCount },
    { id: "reviews", label: "Reviews", count: reviewCount },
  ];

  return (
    <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm rounded-t-2xl overflow-hidden">
      <div className="flex w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 px-4 py-4 sm:px-6 sm:py-5 flex items-center justify-center gap-3 transition-colors ${isActive ? "text-white" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="font-medium text-sm sm:text-base relative z-10">
                {tab.label}
              </span>
              <span
                className={`py-0.5 px-2 rounded-full text-xs font-semibold transition-colors ${isActive
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40"
                    : "bg-gray-800 text-gray-500 border border-white/5"
                  }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;