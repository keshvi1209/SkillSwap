import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SkillExchangeDashboard from './components/SkillExchangeDashboard';
import styles from './App.module.css';
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
          <SkillExchangeDashboard />
        </div>
      </div>
    </div>
  );
}

export default App;
