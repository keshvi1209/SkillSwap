import LearnSkillCard from "./LearnSkillCard";
import EmptyState from "../common/EmptyState";

const LearnTab = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }
        title="No learning goals yet"
        description="Skills to learn will appear here once added"
      />
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map((skill) => (
        <LearnSkillCard key={skill._id} skill={skill} />
      ))}
    </div>
  );
};

export default LearnTab;