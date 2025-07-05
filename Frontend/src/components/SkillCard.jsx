import React from 'react'
import styles from './SkillCard.module.css';
import SkillForm from './SkillForm';

function SkillCard() {
  return (
    <div className={styles.maincard}>
      <h1>Skills I can teach</h1>
      <SkillForm/>
    </div>
  )
}

export default SkillCard