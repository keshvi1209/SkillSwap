import React from "react";
const ModeBadge = ({ mode }) => (
  <span
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
      mode === "online"
        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
        : "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }`}
  >
    {mode.charAt(0).toUpperCase() + mode.slice(1)}
  </span>
);

export default ModeBadge;
