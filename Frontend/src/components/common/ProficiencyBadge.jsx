import React from "react";

const ProficiencyBadge = ({ level }) => {
  let colorClass = "";
  switch (level) {
    case "beginner":
      colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      break;
    case "intermediate":
      colorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
      break;
    case "advanced":
      colorClass = "bg-purple-500/10 text-purple-400 border-purple-500/20";
      break;
    default:
      colorClass = "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }

  return (
    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${colorClass}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};

export default ProficiencyBadge;