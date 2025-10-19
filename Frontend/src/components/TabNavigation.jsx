const TabNavigation = ({ activeTab, onTabChange, teachCount, learnCount, reviewCount }) => {
  const tabs = [
    { id: "teach", label: "Skills to Teach", count: teachCount },
    { id: "learn", label: "Skills to Learn", count: learnCount },
    { id: "reviews", label: "Reviews", count: reviewCount },
  ];

  return (
    <div className="border-b border-gray-700/50">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-4 font-semibold text-sm md:text-base transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/5"
                : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            <span className="ml-2 bg-gray-700/50 text-gray-300 text-xs py-1 px-2.5 rounded-full font-medium">
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;