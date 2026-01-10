import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AvailabilityCard from "../booking/AvailabilityCard.jsx";
import SuccessAlert from "../common/SuccessAlert.jsx";
import api from "../../services/api";


function EditCanteach() {
  const location = useLocation();
  const { id } = location.state || {};

  console.log("Editing skill with ID:", id);

  const [showCard, setShowCard] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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
      const token = localStorage.getItem("token");
      try {
        const response = await api.get(`/editcanteachskills/${id}`);

        const result = await response.json();

        if (response.ok && result) {
          setRawTags(result.tags ? result.tags.join(", ") : "");
          setRawLanguages(result.languages ? result.languages.join(", ") : "");

          setFormData({
            skill: result.skill || "",
            experience: result.experience || "",
            description: result.description || "",
            proficiency: result.proficiency || "",
            mode: result.mode || "",
            languages: result.languages || [],
            tags: result.tags || [],
            availability: result.availability || null,
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

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

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/savecanteachskills/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData), // ✅ send JSON
        }
      );

      const result = await response.json();
      console.log("Update success:", result);

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[545px] flex flex-col border border-gray-100">
        <div className="px-6 py-5 bg-indigo-600 rounded-t-2xl shadow-sm">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Edit Skills That You Can Teach
          </h2>
        </div>

        <form
          className="flex-1 overflow-y-auto px-8 py-6 space-y-5"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="skill"
              value={formData.skill}
              onChange={handleChange}
              placeholder="Skill *"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Experience (years) *"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description *"
            rows={3}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              name="proficiency"
              value={formData.proficiency}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            >
              <option value="">Select proficiency</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <button
              type="button"
              onClick={showAvailabilityPopup}
              className={`px-4 py-2 rounded-lg w-full transition ${formData.availability
                ? "border border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
            >
              {formData.availability
                ? "Availability Set ✓"
                : "Set Availability"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            >
              <option value="">Select mode</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="both">Both</option>
            </select>
            <input
              type="text"
              name="languages"
              value={rawLanguages}
              onChange={handleChange}
              placeholder="Languages (comma separated)"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          <input
            type="text"
            name="tags"
            value={rawTags}
            onChange={handleChange}
            placeholder="Tags (comma separated) *"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />

          <div className="flex gap-4 justify-end pt-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Save
            </button>
          </div>
        </form>

        {showCard && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Set Your Availability</h3>
                <button
                  onClick={closeCard}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <AvailabilityCard
                  closeCard={closeCard}
                  saveAvailability={handleAvailabilitySave}
                />
              </div>
            </div>
          </div>
        )}

        {showAlert && <SuccessAlert onClose={() => setShowAlert(false)} />}
      </div>
    </div>
  );
}

export default EditCanteach;
