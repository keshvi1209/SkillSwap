import React, { useState } from "react";
import Addedskillssummary from "./Addedskillssummary.jsx";
import api from "../../services/api";
import { ChevronDown, ChevronUp, BookOpen, GraduationCap } from "lucide-react";

function SkillsSummary() {
  const [isOpen, setIsOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isOpen2, setIsOpen2] = useState(false);
  const [skills2, setSkills2] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState(null);

  // ---- Fetch for "Can Teach" ----
  const fetchCanTeachSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/getcanteachskills");
      const data = response.data;

      console.log("CanTeach API Response:", data);

      if (data.canTeach && Array.isArray(data.canTeach)) {
        setSkills(data.canTeach);
      } else {
        setSkills([]);
        console.warn("Unexpected API response structure for canTeach:", data);
      }
    } catch (error) {
      console.error("Error fetching canTeach skills:", error);
      setError(error.response?.data?.message || error.message);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  // ---- Fetch for "Want to Learn" ----
  const fetchToLearnSkills = async () => {
    setLoading2(true);
    setError2(null);
    try {
      const response = await api.get("/gettolearnskills");
      const data = response.data;

      console.log("ToLearn API Response:", data);

      if (data.toLearn && Array.isArray(data.toLearn)) {
        setSkills2(data.toLearn);
      } else {
        setSkills2([]);
        console.warn("Unexpected API response structure for toLearn:", data);
      }
    } catch (error) {
      console.error("Error fetching toLearn skills:", error);
      setError2(error.response?.data?.message || error.message);
      setSkills2([]);
    } finally {
      setLoading2(false);
    }
  };

  // ---- Handlers ----
  const handleClick = () => {
    if (!isOpen && skills.length === 0) {
      fetchCanTeachSkills();
    }
    setIsOpen(!isOpen);
  };

  const handleClick2 = () => {
    if (!isOpen2 && skills2.length === 0) {
      fetchToLearnSkills();
    }
    setIsOpen2(!isOpen2);
  };

  const SummarySection = ({
    title,
    isOpen,
    onToggle,
    icon: Icon,
    loading,
    error,
    skillsData,
    emptyMessage
  }) => (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60 backdrop-blur-xl shadow-xl transition-all hover:shadow-purple-500/10 hover:border-purple-500/30">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${isOpen ? 'from-purple-500 to-indigo-500' : 'from-gray-700 to-gray-800'} text-white shadow-lg transition-all duration-300`}>
            <Icon size={24} />
          </div>
          <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>
        </div>

        <div className={`p-2 rounded-full border border-gray-700/50 bg-gray-800/50 text-gray-400 transition-all duration-300 ${isOpen ? 'rotate-180 bg-purple-500/20 text-purple-300 border-purple-500/30' : ''}`}>
          <ChevronDown size={20} />
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out border-t border-gray-700/0 ${isOpen ? "max-h-[2000px] opacity-100 border-gray-700/30" : "max-h-0 opacity-0 overflow-hidden"
          }`}
      >
        <div className="p-6 pt-2">
          {loading && (
            <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              <span>Loading skills...</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              Error: {error}
            </div>
          )}

          {!loading && !error && skillsData.length === 0 && (
            <div className="text-center py-8 text-gray-500 italic bg-gray-900/40 rounded-xl border border-dashed border-gray-700/50">
              {emptyMessage || "No skills found."}
            </div>
          )}

          {!loading && !error && skillsData.length > 0 && (
            <Addedskillssummary skills={skillsData} />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <SummarySection
        title="Skills I Can Teach"
        isOpen={isOpen}
        onToggle={handleClick}
        icon={GraduationCap}
        loading={loading}
        error={error}
        skillsData={skills}
        emptyMessage="You aren't teaching any skills yet."
      />

      <SummarySection
        title="Skills I Want to Learn"
        isOpen={isOpen2}
        onToggle={handleClick2}
        icon={BookOpen}
        loading={loading2}
        error={error2}
        skillsData={skills2}
        emptyMessage="You haven't added any skills to learn yet."
      />
    </div>
  );
}

export default SkillsSummary;
