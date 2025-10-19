import React, { useState } from "react";
import SuccessAlert from "./SuccessAlert.jsx";
import api from "../api";

function Tolearn() {
  const [formData, setFormData] = useState({
    skill: "",
    proficiency: "",
    mode: "",
    languages: [],
    tags: [],
  });

  const [rawLanguages, setRawLanguages] = useState("");
  const [rawTags, setRawTags] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "languages") {
      setRawLanguages(value);
      const languagesArray = value
        .split(",")
        .map((lang) => lang.trim())
        .filter((lang) => lang !== "");
      setFormData((prev) => ({
        ...prev,
        languages: languagesArray,
      }));
    } else if (name === "tags") {
      setRawTags(value);
      const tagsArray = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      setFormData((prev) => ({
        ...prev,
        tags: tagsArray,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      skill: formData.skill,
      proficiency: formData.proficiency,
      mode: formData.mode,
      languages: formData.languages,
      tags: formData.tags,
    };
    
    const token = localStorage.getItem("token");
    try {
      const response = await api.post("/tolearnskills", payload);
      const result = await response.json();
      console.log("Upload success:", result);

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setFormData({
          skill: "",
          proficiency: "",
          mode: "",
          languages: [],
          tags: [],
        });
        setRawLanguages("");
        setRawTags("");
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Skill Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Skill <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] text-white placeholder-gray-400 transition-all duration-200"
          placeholder="Enter the skill you want to learn"
          name="skill"
          value={formData.skill}
          onChange={handleChange}
          required
        />
      </div>

      {/* Proficiency Level */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Current Proficiency Level <span className="text-red-400">*</span>
        </label>
        <select
          className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] text-white transition-all duration-200"
          name="proficiency"
          value={formData.proficiency}
          onChange={handleChange}
          required
        >
          <option value="" className="bg-[#2d2d37]">Select your current level</option>
          <option value="beginner" className="bg-[#2d2d37]">Beginner</option>
          <option value="intermediate" className="bg-[#2d2d37]">Intermediate</option>
          <option value="advanced" className="bg-[#2d2d37]">Advanced</option>
        </select>
      </div>

      {/* Mode and Languages Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Preferred Mode of Learning <span className="text-red-400">*</span>
          </label>
          <select
            className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] text-white transition-all duration-200"
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            required
          >
            <option value="" className="bg-[#2d2d37]">Select mode</option>
            <option value="online" className="bg-[#2d2d37]">Online</option>
            <option value="offline" className="bg-[#2d2d37]">Offline</option>
            <option value="both" className="bg-[#2d2d37]">Both</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Preferred Language(s) <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] text-white placeholder-gray-400 transition-all duration-200"
            placeholder="e.g., English, Hindi, Spanish"
            name="languages"
            value={rawLanguages}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Tags <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] text-white placeholder-gray-400 transition-all duration-200"
          placeholder="Add relevant tags (e.g., Python, Data Science, Web Development)"
          name="tags"
          value={rawTags}
          onChange={handleChange}
          required
        />
      </div>

      {/* Submit Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-[#6C63FF] to-[#4a3fdb] text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] skill-submit-button"
        >
          Submit
        </button>

        <button
          type="button"
          className="w-full px-6 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 text-white font-semibold rounded-xl transition-all duration-200 hover:bg-[rgba(55,55,65,0.8)] hover:-translate-y-0.5 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
        >
          Added skills
        </button>
      </div>

      {showAlert && <SuccessAlert onClose={() => setShowAlert(false)} />}
    </form>
  );
}

export default Tolearn;