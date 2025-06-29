import React, { useState } from "react";
import TagInput from "./TagInput"; // Still using TagInput for skill-specific tags
import styles from "./SkillInputCard.module.css"; // Component-specific styles
import appStyles from "../App.module.css"; // For common styles like formGroup, primaryButton

function SkillInputCard({
  title,
  buttonText,
  onSubmit,
  isLearningCard = false,
}) {
  const [skills, setSkills] = useState([
    { id: Date.now(), name: "", description: "", tags: [], level: 50 },
  ]);

  const handleAddSkill = () => {
    setSkills((prevSkills) => [
      ...prevSkills,
      { id: Date.now(), name: "", description: "", tags: [], level: 50 },
    ]);
  };

  const handleRemoveSkill = (idToRemove) => {
    setSkills((prevSkills) =>
      prevSkills.filter((skill) => skill.id !== idToRemove)
    );
  };

  const handleSkillChange = (id, field, value) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = skills.every((skill) => skill.name.trim() !== "");
    if (!isValid) {
      alert("Please ensure all skill names are filled before submitting.");
      return;
    }
    if (skills.length === 0) {
      alert("Please add at least one skill.");
      return;
    }

    onSubmit(skills);

    setSkills([
      { id: Date.now(), name: "", description: "", tags: [], level: 50 },
    ]);
  };

  return (
    <div className={styles.skillInputCard}>
      <h3>{title}</h3>
      <form onSubmit={handleSubmit}>
        {skills.map((skill, index) => (
          <div key={skill.id} className={styles.skillEntry}>
            <h4>Skill #{index + 1}</h4>
            {skills.length > 1 && ( 
              <button
                type="button"
                className={styles.removeSkillButton}
                onClick={() => handleRemoveSkill(skill.id)}
              >
                &times; Remove Skill
              </button>
            )}
            <div className={appStyles.formGroup}>
              <label htmlFor={`skill-name-${skill.id}`}>Skill Name</label>
              <input
                type="text"
                id={`skill-name-${skill.id}`}
                className={appStyles.inputField}
                placeholder={
                  isLearningCard
                    ? "e.g., Python Programming"
                    : "e.g., UI/UX Design"
                }
                value={skill.name}
                onChange={(e) =>
                  handleSkillChange(skill.id, "name", e.target.value)
                }
                required
              />
            </div>
            <div className={appStyles.formGroup}>
              <label htmlFor={`skill-description-${skill.id}`}>
                Description
              </label>
              <textarea
                id={`skill-description-${skill.id}`}
                className={`${appStyles.inputField} ${appStyles.textareaField}`}
                placeholder={
                  isLearningCard
                    ? "What specific aspects of this skill do you want to learn?"
                    : "Briefly describe your expertise and what you can teach."
                }
                value={skill.description}
                onChange={(e) =>
                  handleSkillChange(skill.id, "description", e.target.value)
                }
                rows="3"
                required
              ></textarea>
            </div>
            <div className={appStyles.formGroup}>
              <label>Tags</label>
              <TagInput
                tags={skill.tags}
                setTags={(newTags) =>
                  handleSkillChange(skill.id, "tags", newTags)
                }
                placeholder="Add relevant keywords (e.g., frontend, design systems)"
              />
            </div>
            <div className={styles.skillLevelSelectorGroup}>
              <label>Skill Level</label>
              <input
                type="range"
                min="0"
                max="100"
                value={skill.level}
                onChange={(e) =>
                  handleSkillChange(skill.id, "level", parseInt(e.target.value))
                }
                className={styles.skillLevelSlider}
              />
              <span className={styles.skillLevelValue}>{skill.level}%</span>
            </div>
            {index < skills.length - 1 && (
              <hr className={styles.skillSeparator} />
            )}{" "}
            {}
          </div>
        ))}

        <button
          type="button"
          className={styles.addSkillButton}
          onClick={handleAddSkill}
        >
          + Add Another Skill
        </button>

        <button type="submit" className={appStyles.primaryButton}>
          {buttonText}
        </button>
      </form>
    </div>
  );
}

export default SkillInputCard;
