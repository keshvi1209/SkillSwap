import React from 'react';
import styles from './Header.module.css'; // Import as CSS Module

function Header({ userName }) {
  return (
    <header className={styles.header}>
      <div className={styles.welcomeMessage}>Welcome {userName}</div>
      <div className={styles.headerRight}>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search..." />
          {/* Magnifying glass icon could go here */}
        </div>
        <div className={styles.userProfileIcon}>
          {/* User avatar/icon */}
          <img src="https://via.placeholder.com/30" alt="User" /> {/* Placeholder image */}
        </div>
      </div>
    </header>
  );
}

export default Header;