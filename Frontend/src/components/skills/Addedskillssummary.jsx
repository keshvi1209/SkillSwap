import { useNavigate } from "react-router-dom";
import { Pencil, Music, Code, Globe, Clock, BarChart } from "lucide-react";

function Addedskillssummary({ skills }) {
  const Navigate = useNavigate();
  const skillsArray = skills || [];

  if (!skillsArray || skillsArray.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8 italic bg-gray-900/40 rounded-xl border border-dashed border-gray-700">
        No skills added yet. Start by adding some skills!
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {skillsArray.map((skill, index) => {
        const data = {
          skill: skill?.skill || "Skill Name",
          experience: skill?.experience || 0,
          description: skill?.description || "No description provided",
          proficiency: skill?.proficiency || "Beginner",
          mode: skill?.mode || "Online",
          languages: skill?.languages || ["English"],
          tags: skill?.tags || [],
        };

        return (
          <div
            key={index}
            className="group relative flex flex-col justify-between rounded-2xl border border-gray-700/50 bg-gray-800/60 backdrop-blur-md p-6 shadow-xl transition-all hover:scale-[1.02] hover:shadow-purple-500/10 hover:border-purple-500/30"
          >
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-colors">
                    <Code size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {data.skill}
                    </h2>
                    <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <span className={`w-1.5 h-1.5 rounded-full ${data.proficiency === 'Expert' ? 'bg-purple-500' :
                          data.proficiency === 'Intermediate' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></span>
                      {data.proficiency}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    Navigate("/editcanteach", { state: { id: skill._id } })
                  }
                  className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-indigo-500 hover:text-white transition-all transform hover:rotate-12"
                  title="Edit Skill"
                >
                  <Pencil size={18} />
                </button>
              </div>

              <p className="text-sm text-gray-300 mb-6 leading-relaxed line-clamp-3">
                {data.description}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700/50">
                  <Clock size={14} className="text-indigo-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Experience</span>
                    <span className="text-xs text-gray-200 font-medium">{data.experience} yrs</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700/50">
                  <Globe size={14} className="text-pink-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Mode</span>
                    <span className="text-xs text-gray-200 font-medium">{data.mode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Footer */}
            <div className="pt-4 border-t border-gray-700/50">
              <div className="flex flex-wrap gap-2">
                {data.tags.length > 0 ? (
                  data.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-[11px] font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500 italic">No tags</span>
                )}

                {data.languages.length > 0 && (
                  <span className="px-2.5 py-1 text-[11px] font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-md">
                    🗣️ {data.languages[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Addedskillssummary;
