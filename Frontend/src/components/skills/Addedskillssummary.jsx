import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

function Addedskillssummary({ skills }) {
  const Navigate = useNavigate();
  const skillsArray = skills || [];

  if (!skillsArray || skillsArray.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">No skills added yet.</p>
    );
  }

  const onEdit = (skill) => {
    console.log("Edit skill:", skill);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4 bg-white rounded-lg">
      {skillsArray.map((skill, index) => {
        const data = {
          skill: skill?.skill || "Guitar",
          experience: skill?.experience || 1,
          description: skill?.description || "No description provided",
          proficiency: skill?.proficiency || "Beginner",
          mode: skill?.mode || "Online",
          languages: skill?.languages || ["English"],
          tags: skill?.tags || ["dev", "music"],
        };

        return (
          <div
            key={index}
            className="rounded-xl border border-gray-400 bg-stone-200 p-6 shadow-sm transition-transform hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                {/* <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-2xl">
                 🎸
                </div> */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {data.skill}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {data.proficiency} • {data.mode}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  Navigate("/editcanteach", { state: { id: skill._id } })
                }
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 transition px-3 py-1 rounded-full bg-indigo-400 hover:bg-indigo-200"
              >
                <Pencil size={16} /> Edit
              </button>{" "}
            </div>

            <p className="text-sm text-gray-600 mb-4">{data.description}</p>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">
                  <Pencil size={16} />
                </span>
                <span>
                  <span className="font-medium">Experience:</span>{" "}
                  {data.experience} yrs
                </span>
              </div>
              {/* <div className="flex items-center gap-2">
                <span className="text-gray-400">
                  <Pencil size={16} />
                </span>
                <span>
                  <span className="font-medium">Availability:</span>{" "}
                  {data.availability.mode}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">
                  <Pencil size={16} />
                </span>
                <span>
                  <span className="font-medium">Time:</span> {data.time.start} –{" "}
                  {data.time.end}
                </span>
              </div> */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">
                  <Pencil size={16} />
                </span>
                <span>
                  <span className="font-medium">Languages:</span>{" "}
                  {data.languages.join(", ")}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <span className="font-medium text-sm text-gray-600">Tags:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Addedskillssummary;
