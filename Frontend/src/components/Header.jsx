import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Header.module.css";
import myimage from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Header({ userName, redirectToHome }) {
  const navigate = useNavigate();

  const features =["Add Skills", "Search Best Fit", "Scheduled Meetings", "Chat", "Past Sessions"]

  const [active, setActive] = useState("Add Skills");

  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={myimage} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>SkillSwap</h1>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.features}>
        {features.map((item) => (
          <div
            key={item}
            className={styles.featureWrapper}
            onClick={() => setActive(item)}
          >
           <span className={styles.feature}>{item}</span>
            {active === item && (
              <motion.div
                layoutId="underline"
                className={styles.underline}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        ))}
      </div>
      <button className={styles.profile} onClick={() => navigate("/profile")}>Profile</button>
    </div>
  );
}

export default Header;
