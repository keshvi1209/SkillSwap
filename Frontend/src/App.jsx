import React from "react";
import Header from "./components/Header";
import styles from "./App.module.css";
import SkillsEntry from "./pages/SkillsEntry";
import "./index.css";
import { motion } from "framer-motion";
import Welcomesection from "./components/Welcomesection";

function App() {
  const headingText = "Welcome, Name";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, 
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <div className={styles.intro}>
      <Header></Header>
      <Welcomesection>
        <motion.h1
          className={styles.heading}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {headingText.split("").map((char, index) => (
            <motion.span key={index} variants={letterVariants}>
              {char}
            </motion.span>
          ))}
        </motion.h1>
        <h2 className={styles.subheading}>
          Ready to elevate your skills or share your expertise?
          <br />
          Let's get your skill listed!
        </h2>
      </Welcomesection>
      <SkillsEntry />
    </div>
  );
}

export default App;
