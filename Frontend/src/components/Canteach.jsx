import { useState } from "react";
import SuccessAlert from "./SuccessAlert.jsx";
import api from "../api";

function Canteach() {
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    skill: "",
    experience: "",
    description: "",
    proficiency: "",
    mode: "",
    languages: [],
    certificates: [],
    tags: [],
  });

  const [rawTags, setRawTags] = useState("");
  const [rawLanguages, setRawLanguages] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tags") {
      setRawTags(value);
      const tagsArray = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      setFormData((prev) => ({
        ...prev,
        tags: tagsArray,
      }));
    } else if (name === "languages") {
      setRawLanguages(value);
      const languagesArray = value
        .split(",")
        .map((lang) => lang.trim())
        .filter((lang) => lang !== "");
      setFormData((prev) => ({
        ...prev,
        languages: languagesArray,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      certificates: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();
      
      // Append basic form fields
      data.append("skill", formData.skill);
      data.append("experience", formData.experience.toString());
      data.append("description", formData.description);
      data.append("proficiency", formData.proficiency);
      data.append("mode", formData.mode);
      
      // Append arrays - FIXED: Remove brackets from field names
      formData.languages.forEach((lang) => data.append("languages", lang));
      formData.tags.forEach((tag) => data.append("tags", tag));

      // Append files
      formData.certificates.forEach((file, index) => {
        data.append("certificates", file);
      });

      console.log("Submitting data:", {
        skill: formData.skill,
        experience: formData.experience,
        proficiency: formData.proficiency,
        mode: formData.mode,
        languages: formData.languages,
        tags: formData.tags,
        certificateCount: formData.certificates.length
      });

      // FIXED: Remove .json() since api already parses JSON
      const response = await api.post("/canteachskills", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      console.log("Upload success:", response.data);

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        // Reset form
        setFormData({
          skill: "",
          experience: "",
          description: "",
          proficiency: "",
          mode: "",
          languages: [],
          certificates: [],
          tags: [],
        });
        setRawTags("");
        setRawLanguages("");
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Failed to submit skill. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Skill and Experience Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Skill <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] text-white placeholder-gray-400 transition-all duration-200"
              placeholder="Enter your skill"
              name="skill"
              value={formData.skill}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Years of Experience <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] text-white placeholder-gray-400 transition-all duration-200"
              placeholder="Enter years"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              min="0"
              max="50"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Description <span className="text-red-400">*</span>
            </label>
          <textarea
            className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] text-white placeholder-gray-400 transition-all duration-200 resize-none"
            placeholder="Describe your skill"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Proficiency and Mode Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Proficiency Level <span className="text-red-400">*</span>
            </label>
            <select
              className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] text-white transition-all duration-200"
              name="proficiency"
              value={formData.proficiency}
              onChange={handleChange}
              required
            >
              <option value="" className="bg-[#2d2d37]">Select</option>
              <option value="beginner" className="bg-[#2d2d37]">Beginner</option>
              <option value="intermediate" className="bg-[#2d2d37]">Intermediate</option>
              <option value="advanced" className="bg-[#2d2d37]">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Mode of Teaching <span className="text-red-400">*</span>
            </label>
            <select
              className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] text-white transition-all duration-200"
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              required
            >
              <option value="" className="bg-[#2d2d37]">Select</option>
              <option value="online" className="bg-[#2d2d37]">Online</option>
              <option value="offline" className="bg-[#2d2d37]">Offline</option>
              <option value="both" className="bg-[#2d2d37]">Both</option>
            </select>
          </div>
        </div>

        {/* Languages and Tags Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Languages <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] text-white placeholder-gray-400 transition-all duration-200"
              placeholder="e.g., English, Hindi"
              name="languages"
              value={rawLanguages}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Tags <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] text-white placeholder-gray-400 transition-all duration-200"
              placeholder="e.g., Python, Data Science"
              name="tags"
              value={rawTags}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Certificates */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Upload Certificates / Work Samples
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6C63FF] file:text-white hover:file:bg-[#5a52d5] transition-all duration-200"
            name="certificates"
            onChange={handleFileChange}
          />
        </div>

        {/* Submit Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 font-semibold rounded-xl transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-[#6C63FF] to-[#4a3fdb] text-white hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5"
            } focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          <button
            type="button"
            className="w-full px-6 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 text-white font-semibold rounded-xl transition-all duration-200 hover:bg-[rgba(55,55,65,0.8)] hover:-translate-y-0.5 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
          >
            Added skills
          </button>
        </div>
      </form>

      {showAlert && <SuccessAlert onClose={() => setShowAlert(false)} />}
    </>
  );
}

export default Canteach;