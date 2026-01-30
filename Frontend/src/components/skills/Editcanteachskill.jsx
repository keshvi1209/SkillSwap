import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AvailabilityCard from "../booking/AvailabilityCard.jsx";
import SuccessAlert from "../common/SuccessAlert.jsx";
import api from "../../services/api";
import {
  BookOpen,
  Clock,
  AlignLeft,
  BarChart,
  Monitor,
  Globe,
  Tag,
  Calendar,
  Save,
  X
} from "lucide-react";

function EditCanteach() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};

  console.log("Editing skill with ID:", id);

  const [showCard, setShowCard] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    skill: "",
    experience: "",
    description: "",
    proficiency: "",
    mode: "",
    languages: [],
    tags: [],
    availability: null,
  });

  const [rawTags, setRawTags] = useState("");
  const [rawLanguages, setRawLanguages] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/editcanteachskills/${id}`);
        const result = await response.data; // Axios returns data in data property, or use result directly if api.get returns response object

        // Handle both axios and fetch style responses just in case, though api.js usually returns axios response
        const data = result;

        if (data) {
          setRawTags(data.tags ? data.tags.join(", ") : "");
          setRawLanguages(data.languages ? data.languages.join(", ") : "");

          setFormData({
            skill: data.skill || "",
            experience: data.experience || "",
            description: data.description || "",
            proficiency: data.proficiency || "",
            mode: data.mode || "",
            languages: data.languages || [],
            tags: data.tags || [],
            availability: data.availability || null,
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tags") {
      setRawTags(value);
      setFormData((prev) => ({
        ...prev,
        tags: value
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }));
    } else if (name === "languages") {
      setRawLanguages(value);
      setFormData((prev) => ({
        ...prev,
        languages: value
          .split(",")
          .map((lang) => lang.trim())
          .filter(Boolean),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const showAvailabilityPopup = () => setShowCard(true);
  const closeCard = () => setShowCard(false);

  const handleAvailabilitySave = (availabilityData) => {
    setFormData((prev) => ({ ...prev, availability: availabilityData }));
    closeCard();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.availability) {
      alert("Please set your availability.");
      return;
    }

    try {
      await api.put(`/savecanteachskills/${id}`, formData);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-gray-900 to-purple-900/20 z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-white/5 rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 text-white">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Edit Skill</h2>
              <p className="text-sm text-gray-400">Update your teaching details and preferences</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>
          ) : (
            <form id="skill-form" onSubmit={handleSubmit} className="p-8 space-y-8">

              {/* Basic Info Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  Basic Information
                  <div className="h-px bg-white/10 flex-1" />
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skill Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Skill Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                        <BookOpen size={18} />
                      </div>
                      <input
                        type="text"
                        name="skill"
                        value={formData.skill}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        placeholder="e.g. Guitar, Python, Cooking"
                        required
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Experience (Years)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                        <Clock size={18} />
                      </div>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Description</label>
                  <div className="relative group">
                    <div className="absolute top-3 left-3 pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                      <AlignLeft size={18} />
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                      placeholder="Describe what you will teach..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  Teaching Details
                  <div className="h-px bg-white/10 flex-1" />
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Proficiency */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Proficiency Level</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                        <BarChart size={18} />
                      </div>
                      <select
                        name="proficiency"
                        value={formData.proficiency}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="" className="bg-gray-900 text-gray-500">Select Level</option>
                        <option value="Beginner" className="bg-gray-900">Beginner</option>
                        <option value="Intermediate" className="bg-gray-900">Intermediate</option>
                        <option value="Advanced" className="bg-gray-900">Advanced</option>
                        <option value="Expert" className="bg-gray-900">Expert</option>
                      </select>
                    </div>
                  </div>

                  {/* Mode */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Teaching Mode</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                        <Monitor size={18} />
                      </div>
                      <select
                        name="mode"
                        value={formData.mode}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="" className="bg-gray-900 text-gray-500">Select Mode</option>
                        <option value="Online" className="bg-gray-900">Online</option>
                        <option value="Offline" className="bg-gray-900">Offline</option>
                        <option value="Both" className="bg-gray-900">Both</option>
                      </select>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Languages</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                        <Globe size={18} />
                      </div>
                      <input
                        type="text"
                        name="languages"
                        value={rawLanguages}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        placeholder="English, Spanish..."
                        required
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Tags</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                        <Tag size={18} />
                      </div>
                      <input
                        type="text"
                        name="tags"
                        value={rawTags}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                        placeholder="programming, music..."
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={showAvailabilityPopup}
                  className={`w-full group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ${formData.availability
                      ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                      : "bg-gray-800/50 border-gray-700/50 text-gray-300 hover:border-indigo-500/50 hover:text-indigo-300"
                    }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Calendar size={20} className={formData.availability ? "text-green-500" : "text-gray-400 group-hover:text-indigo-400"} />
                    <span className="font-semibold">{formData.availability ? "Availability Configured ✓" : "Configure Weekly Availability"}</span>
                  </div>
                </button>
              </div>

            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-white/10 bg-white/5 rounded-b-3xl">
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              form="skill-form"
              type="submit"
              className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>

        {/* Start Availability Modal */}
        {showCard && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-white/5">
                <h3 className="text-xl font-semibold text-white">Availability Settings</h3>
                <button
                  onClick={closeCard}
                  className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <AvailabilityCard
                  closeCard={closeCard}
                  saveAvailability={handleAvailabilitySave}
                  initialData={formData.availability ? { availability: formData.availability } : null}
                />
              </div>
            </div>
          </div>
        )}

        {/* Alerts */}
        {showAlert && <SuccessAlert onClose={() => setShowAlert(false)} />}

      </div>
    </div>
  );
}

export default EditCanteach;
