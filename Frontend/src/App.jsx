import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import styles from "./App.module.css";
import SkillsEntry from "./pages/SkillsEntry";
import "./index.css";
import Welcomesection from "./components/Welcomesection";
import AddSkillForm from "./pages/AddSkillForm";

function App() {
  return (
    <div className={styles.intro}>
      <Header></Header>
      <Welcomesection>
        <h1 className={styles.heading}>Welcome, Name</h1>
        <h2 className={styles.subheading}>
          Ready to elevate your skills or share your expertise?
          <br />
          Let's get your skill listed!
        </h2>
      </Welcomesection>
      <SkillsEntry/>
    </div>
  );
}

export default App;
