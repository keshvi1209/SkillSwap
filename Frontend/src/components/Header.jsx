import React from "react";
import styles from "./Header.module.css"; 
import myimage from "../assets/logo.png"; 

function Header({ userName, redirectToHome }) {
  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={myimage} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>SkillSwap</h1>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.features}>
        <span className={styles.feature}>Add Skills</span>
        <span className={styles.feature}>Search Best Fit</span>
        <span className={styles.feature}>Scheduled Meetings</span>
        <span className={styles.feature}>Chat</span>
        <span className={styles.feature}>Past Sessions</span>
      </div>
      <button className={styles.profile}>Profile</button>
    </div>
  );
}

export default Header;
