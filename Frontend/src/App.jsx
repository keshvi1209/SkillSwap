import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import styles from './App.module.css';
import SkillsEntry from './pages/SkillsEntry';
import './index.css';

function App() {
  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div className={styles.mainContentArea}>
        <div className={styles.headerSection}>
          <Header userName="Name" />
        </div>

        <div className={styles.contentWrapper}>
          {<SkillsEntry/>}
        </div>
      </div>
    </div>
  );
}

export default App;