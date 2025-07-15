import React, { useState } from "react";
import styles from "./SkillsEntry.module.css";
import Canteach from "../components/Canteach.jsx";
import Tolearn from "../components/Tolearn.jsx";

function SkillsEntry() {
  const [Activestate, setActivestate] = useState("canteach");

  return (
    <div className={styles.container}>
      <div className={styles.mainform}>
        <div className={styles.buttoncontainer}>
          <button
            className={`${styles.cardselect1} ${Activestate === "canteach" ? styles.active : ""}`}
            onClick={() => setActivestate("canteach")}
          >
            Can Teach
          </button>
          <button
            className={`${styles.cardselect2} ${Activestate === "tolearn" ? styles.active : ""}`}
            onClick={() => setActivestate("tolearn")}
          >
            To Learn
          </button>
        </div>

        {Activestate === "canteach" ? <Canteach /> : <Tolearn />}
      </div>
    </div>
  );
}

export default SkillsEntry;
