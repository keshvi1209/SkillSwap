import React, { useState } from "react";
import styles from "../pages/SkillsEntry.module.css";
import SuccessAlert from "./SuccessAlert.jsx";

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
    <form className={styles.canteachform} onSubmit={handleSubmit}>
      <div className={styles.rowContainer}>
        <div className={styles.selectContainer}>
          <label className={styles.inputhead}>
            Skill<span className={styles.required}>*</span>
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
      </div>

      <div className={styles.rowContainer}>
        <div className={styles.selectContainer}>
          <label className={styles.inputhead}>
            Current Proficiency Level<span className={styles.required}>*</span>
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
      </div>

      <div className={styles.rowContainer}>
        <div className={styles.modeselectContainer}>
          <label className={styles.inputhead}>
            Preferred Mode of Learning<span className={styles.required}>*</span>
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
            Preferred Language(s)<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Languages you want to learn in"
            name="languages"
            value={rawLanguages}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.rowContainer}>
        <div className={styles.yearelectContainer}>
          <label className={styles.inputhead}>
            Tags<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Add tags (e.g., #Python, #DataScience)"
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

export default Tolearn;
