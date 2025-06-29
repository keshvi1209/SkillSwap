import React from 'react';
import styles from './Sidebar.module.css'; // Import as CSS Module

function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.sidebarLogo}>SkillSwap</div>
      <ul>
        <li className={styles.active}>
          <a href="#home" className={styles.sidebarA}>Home</a>
        </li>
        <li>
          <a href="#offer-skills" className={styles.sidebarA}>Offer Your Skills</a>
        </li>
        <li>
          <a href="#learn-skills" className={styles.sidebarA}>Skills You Want to Learn</a>
        </li>
        <li>
          <a href="#availability" className={styles.sidebarA}>Availability for Swaps</a>
        </li>
        <li>
          <a href="#products" className={styles.sidebarA}>Products</a>
        </li>
        <li>
          <a href="#customers" className={styles.sidebarA}>Customers</a>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;