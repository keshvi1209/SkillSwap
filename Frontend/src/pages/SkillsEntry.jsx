import React from 'react'
import styles from './SkillsEntry.module.css'
import SkillCard from '../components/SkillCard'

function SkillsEntry() {
  return (
    <div>
    <p className={styles.head}>Add Your Skills here</p>
    <h1 className={styles.collabheading}>Share What You Know, Learn What You Love</h1>
    <div className={styles.skillCardContainer}>
      <SkillCard />
      <SkillCard />
    </div>
  </div>
  )
}

export default SkillsEntry