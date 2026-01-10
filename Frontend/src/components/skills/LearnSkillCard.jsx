import ProficiencyBadge from "../common/ProficiencyBadge";
import ModeBadge from "../common/ModeBadge";

const LearnSkillCard = ({ skill }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-3">{skill.skill}</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        <ProficiencyBadge level={skill.proficiency} />
        <ModeBadge mode={skill.mode} />
      </div>

      {skill.languages && skill.languages.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wide">Languages</h4>
          <div className="flex flex-wrap gap-2">
            {skill.languages.map((lang, idx) => (
              <span key={idx} className="bg-gray-700/50 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-600/30">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {skill.tags && skill.tags.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-2">
            {skill.tags.map((tag, idx) => (
              <span key={idx} className="bg-indigo-500/10 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-indigo-500/20">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnSkillCard;