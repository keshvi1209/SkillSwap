import { useState } from "react";
import styles from "../pages/SkillsEntry.module.css";
import AvailabilityCard from "./AvailabilityCard";
import SuccessAlert from "./SuccessAlert.jsx";

function Canteach() {
  const [showCard, setShowCard] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [formData, setFormData] = useState({
    skill: "",
    experience: "",
    description: "",
    proficiency: "",
    mode: "",
    languages: [],
    certificates: [],
    tags: [],
    availability: null,
  });

  const [rawTags, setRawTags] = useState("");
  const [rawLanguages, setRawLanguages] = useState("");

  const showAvailabilityPopup = () => setShowCard(true);
  const closeCard = () => setShowCard(false);

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

  const handleAvailabilitySave = (availabilityData) => {
    setFormData((prev) => ({
      ...prev,
      availability: availabilityData,
    }));
    closeCard();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.availability) {
      alert("Please set your availability.");
      return;
    }

    const data = new FormData();
    data.append("skill", formData.skill);
    data.append("experience", formData.experience);
    data.append("description", formData.description);
    data.append("proficiency", formData.proficiency);
    data.append("mode", formData.mode);
    data.append("availability", JSON.stringify(formData.availability));

    formData.languages.forEach((lang) => data.append("languages[]", lang));
    formData.tags.forEach((tag) => data.append("tags[]", tag));

    formData.certificates.forEach((file) => {
      data.append("certificates", file);
    });

    try {
      const response = await fetch("http://localhost:5000/canteachskills", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      console.log("Upload success:", result);


      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);

        setFormData({
          skill: "",
          experience: "",
          description: "",
          proficiency: "",
          mode: "",
          languages: [],
          certificates: [],
          tags: [],
          availability: null,
        });
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <form className={styles.canteachform} onSubmit={handleSubmit}>
      <div className={styles.rowContainer}>
        <div className={styles.selectContainer}>
          <label className={styles.inputhead}>
            Skill <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter your skill"
            name="skill"
            value={formData.skill}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.yearselectContainer}>
          <label className={styles.inputhead}>
            Years of Experience <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            className={styles.input}
            placeholder="Enter years"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.inputContainer}>
        <label className={styles.inputhead}>
          Description <span className={styles.required}>*</span>
        </label>
        <textarea
          className={styles.input}
          placeholder="Describe your skill"
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className={styles.rowContainer}>
        <div className={styles.selectContainer}>
          <label className={styles.inputhead}>
            Proficiency Level <span className={styles.required}>*</span>
          </label>
          <select
            className={styles.select}
            name="proficiency"
            value={formData.proficiency}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className={styles.availabilityContainer}>
          <button
            type="button"
            className={styles.availabilitybutton}
            onClick={showAvailabilityPopup}
            required
          >
            Set Availability <span className={styles.required}>*</span>
          </button>

          {showCard && (
            <div className={styles.popupOverlay} onClick={closeCard}>
              <div
                className={styles.popupCard}
                onClick={(e) => e.stopPropagation()}
              >
                <AvailabilityCard
                  closeCard={closeCard}
                  saveAvailability={handleAvailabilitySave}
                />
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeCard();
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.rowContainer}>
        <div className={styles.modeselectContainer}>
          <label className={styles.inputhead}>
            Mode of Teaching <span className={styles.required}>*</span>
          </label>
          <select
            className={styles.select}
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div className={styles.languageselectContainer}>
          <label className={styles.inputhead}>
            Languages <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g., English, Hindi"
            name="languages"
            value={rawLanguages}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.rowContainer}>
        <div className={styles.selectContainer}>
          <label className={styles.inputhead}>
            Upload Certificates / Work Samples
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className={styles.input}
            name="certificates"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className={styles.rowContainer}>
        <div className={styles.yearelectContainer}>
          <label className={styles.inputhead}>
            Tags <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g., Python, Data Science"
            name="tags"
            value={rawTags}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.rowContainer}>
        <div className={styles.submitContainer}>
          <button type="submit" className={styles.submitbutton}>
            Submit
          </button>
        </div>

        <div className={styles.skillcheckbuttonContainer}>
          <button type="button" className={styles.custombutton}>
            Added skills
          </button>
        </div>
      </div>

      {showAlert && <SuccessAlert onClose={() => setShowAlert(false)} />}
    </form>
  );
}

export default Canteach;
