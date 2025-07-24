import React from 'react'
import styles from "../pages/SkillsEntry.module.css";

function Tolearn() {
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

         
        </div>

        <div className={styles.rowContainer}>
          <div className={styles.selectContainer}>
            <label className={styles.inputhead}>Current Proficiency Level</label>
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

        
        </div>

        <div className={styles.rowContainer}>
          <div className={styles.modeselectContainer}>
            <label className={styles.inputhead}>Preferred Mode of Learning</label>
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
            <label className={styles.inputhead}>Preferred Language(s)</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Languages you want to learn in"
              name="languages"
              // value={formData.languages}
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
            </button>
          </div>
        </div>
      
    </form>
  )
}

export default Tolearn