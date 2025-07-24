import { useState } from "react";
import styles from "../pages/SkillsEntry.module.css";
import AvailabilityCard from "./AvailabilityCard";

function Canteach() {
  const [showCard, setShowCard] = useState(false);

  const showAvailabilityPopup = () => {
    setShowCard(true);
  };

  const closeCard = () => {
    setShowCard(false);
  };

  return (
    <form className={styles.canteachform}>
      <div className={styles.rowContainer}>
        <div className={styles.selectContainer}>
          <label className={styles.inputhead}>Skill</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter your skill"
            name="skill"
            // value={formData.skill}
            // onChange={handleChange}
          />
        </div>

        <div className={styles.yearselectContainer}>
          <label className={styles.inputhead}>Years of Experience</label>
          <input
            type="number"
            className={styles.input}
            placeholder="Enter years"
            name="experience"
            // value={formData.experience}
            // onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.inputContainer}>
        <label className={styles.inputhead}>Description</label>
        <textarea
          className={styles.input}
          placeholder="Describe your skill"
          rows={4}
          name="description"
          // value={formData.description}
          // onChange={handleChange}
        ></textarea>
      </div>

      <div className={styles.rowContainer}>
        <div className={styles.selectContainer}>
          <label className={styles.inputhead}>Proficiency Level</label>
          <select
            className={styles.select}
            name="proficiency"
            // value={formData.proficiency}
            // onChange={handleChange}
          >
            <option value="null">Select</option>
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
          >
            Set Availability
          </button>
          {showCard && (
            <div className={styles.popupOverlay} onClick={closeCard}>
              <div
                className={styles.popupCard}
                onClick={(e) => e.stopPropagation()}
              >
                <AvailabilityCard closeCard={closeCard} />
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents event bubbling
                    closeCard();
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          )}{" "}
        </div>
      </div>

      <div className={styles.rowContainer}>
        <div className={styles.modeselectContainer}>
          <label className={styles.inputhead}>Mode of Teaching</label>
          <select
            className={styles.select}
            name="mode"
            // value={formData.mode}
            // onChange={handleChange}
          >
            <option value="null">Select</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div className={styles.languageselectContainer}>
          <label className={styles.inputhead}>Languages</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Languages you can teach in"
            name="languages"
            // value={formData.languages}
            // onChange={handleChange}
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
            // name="certificates"
            // onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.rowContainer}>
        <div className={styles.yearelectContainer}>
          <label className={styles.inputhead}>Tags</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Add tags (e.g., #Python, #DataScience)"
            name="tags"
            // value={formData.tags}
            // onChange={handleChange}
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
            {/* <span className={styles.badge}>4</span> */}
          </button>
        </div>
      </div>

      {/* {showAvailabilityPopup && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <p>[Availability Modal Placeholder]</p>
                <button >
                  Close
                </button>
              </div>
            )} */}
    </form>
  );
}

export default Canteach;
