import React from "react";
import Header from "./components/Header";
import styles from "./App.module.css";
import SkillsEntry from "./pages/SkillsEntry";
import "./index.css";
import { motion } from "framer-motion";
import Welcomesection from "./components/Welcomesection";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  const headingText = `Welcome, ${user?.name} !`;

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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
      <div className={styles.intro}>
        <Header></Header>
        <Welcomesection>
          <motion.div
            key={user?.name}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className={styles.heading}>
              {headingText.split("").map((char, index) => (
                <motion.span key={index} variants={letterVariants}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h1>
          </motion.div>

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