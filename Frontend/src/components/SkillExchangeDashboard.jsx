import React from "react";
import SkillInputCard from "./SkillInputCard";
import AvailabilityScheduler from "./AvailabilityScheduler";
import styles from "./SkillExchangeDashboard.module.css";

function SkillExchangeDashboard() {
  const handleOfferSkillSubmit = (skillsDataArray) => {
    console.log("Offering Skills:", skillsDataArray);
    skillsDataArray.forEach((skill) => {
      console.log(
        `Submitting Offered Skill: Name: ${skill.name}, Desc: ${skill.description}, Tags: ${skill.tags.join(", ")}, Level: ${skill.level}`
      );
    });
  };

  const handleLearnSkillSubmit = (skillsDataArray) => {
    console.log("Skills You Want to Learn:", skillsDataArray);
    skillsDataArray.forEach((skill) => {
      console.log(
        `Submitting Learning Skill: Name: ${skill.name}, Desc: ${skill.description}, Tags: ${skill.tags.join(", ")}, Level: ${skill.level}`
      );
    });
  };

  const handleAvailabilityUpdate = (availabilityData) => {
    console.log("Availability Updated:", availabilityData);
  };

  return (
    <div className={styles.skillExchangeDashboard}>
      <div className={styles.skillCardsRow}>
        <SkillInputCard
          title="Offer Your Skills"
          buttonText="Offer Skills"
          onSubmit={handleOfferSkillSubmit}
        />
        <SkillInputCard
          title="Skills You Want to Learn"
          buttonText="Find Mentors"
          onSubmit={handleLearnSkillSubmit}
          isLearningCard
        />
      </div>
      <div className={styles.availabilitySection}>
        <AvailabilityScheduler onSubmit={handleAvailabilityUpdate} />
      </div>
    </div>
  );
}

export default SkillExchangeDashboard;
