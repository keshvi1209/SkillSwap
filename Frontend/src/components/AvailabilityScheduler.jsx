import React, { useState } from 'react';
import styles from './AvailabilityScheduler.module.css'; 
import appStyles from '../App.module.css'; 

function AvailabilityScheduler({ onSubmit }) {
  const [selectedHours, setSelectedHours] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Sun to Sat
  const availableHours = Array.from({ length: 12 }, (_, i) => 9 + i); // 9 AM to 8 PM

  const toggleHour = (hour) => {
    setSelectedHours(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort((a, b) => a - b)
    );
  };

  const toggleDay = (dayIndex) => {
    setSelectedDays(prev =>
      prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex].sort((a, b) => a - b)
    );
  };

  const handleSaveAvailability = () => {
    onSubmit({ selectedDays, selectedHours });
  };

  return (
    <div className={styles.availabilitySchedulerCard}>
      <h3>Availability for Swaps</h3>
      <div className={appStyles.formGroup}>
        <label>Your Available Hours (Example)</label>
        <div className={styles.availabilityGrid}>
          {/* Days of the week */}
          <div className={styles.gridHeaderRow}>
            <span className={`${styles.gridCell} ${styles.placeholder}`}></span> {/* Empty corner */}
            {daysOfWeek.map((day, index) => (
              <span
                key={index}
                className={`${styles.gridCell} ${styles.dayLabel} ${selectedDays.includes(index) ? styles.selected : ''}`}
                onClick={() => toggleDay(index)}
              >
                {day}
              </span>
            ))}
          </div>

          {/* Time slots */}
          {availableHours.map(hour => (
            <div key={hour} className={styles.gridRow}>
              <span className={`${styles.gridCell} ${styles.hourLabel}`}>{hour}:00</span>
              {daysOfWeek.map((day, dayIndex) => (
                <span
                  key={`${hour}-${dayIndex}`}
                  className={`${styles.gridCell} ${styles.timeSlot} ${selectedHours.includes(hour) && selectedDays.includes(dayIndex) ? styles.selected : ''}`}
                  onClick={() => { toggleHour(hour); toggleDay(dayIndex); }} // Select both for simplicity
                ></span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button type="button" className={appStyles.primaryButton} onClick={handleSaveAvailability}>
        Update Availability
      </button>
    </div>
  );
}

export default AvailabilityScheduler;