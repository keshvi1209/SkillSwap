import React, { useState } from "react";
import styles from "./AvailabilityCard.module.css";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AvailabilityCard({ closeCard, saveAvailability }) {
  const [mode, setMode] = useState("daily");
  const [dailyTime, setDailyTime] = useState({ start: "", end: "" });
  const [manualTime, setManualTime] = useState(
    days.reduce((acc, day) => {
      acc[day] = { start: "", end: "" };
      return acc;
    }, {})
  );

  const handleDailyChange = (e) => {
    const { name, value } = e.target;
    setDailyTime({ ...dailyTime, [name]: value });
  };

  const handleManualChange = (day, name, value) => {
    setManualTime({
      ...manualTime,
      [day]: {
        ...manualTime[day],
        [name]: value,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const availabilityData =
      mode === "daily"
        ? { mode, time: dailyTime }
        : { mode, time: manualTime };

    console.log("Availability submitted:", availabilityData);

    if (saveAvailability) {
      saveAvailability(availabilityData);
    }

    closeCard();
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>Set Your Availability</h2>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={`${styles.toggleButton} ${mode === "daily" ? styles.active : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setMode("daily");
          }}
        >
          Same Time Daily
        </button>

        <button
          type="button"
          className={`${styles.toggleButton} ${mode === "manual" ? styles.active : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setMode("manual");
          }}
        >
          Set Manually
        </button>
      </div>

      {mode === "daily" ? (
        <div className={styles.timeInputs}>
          <label>
            Start Time:
            <input
              type="time"
              name="start"
              value={dailyTime.start}
              onChange={handleDailyChange}
              className={styles.input}
            />
          </label>
          <label>
            End Time:
            <input
              type="time"
              name="end"
              value={dailyTime.end}
              onChange={handleDailyChange}
              className={styles.input}
            />
          </label>
        </div>
      ) : (
        <div className={styles.manualContainer}>
          {days.map((day) => (
            <div key={day} className={styles.dayRow}>
              <span>{day}</span>
              <div className={styles.timePair}>
                <input
                  type="time"
                  value={manualTime[day].start}
                  onChange={(e) =>
                    handleManualChange(day, "start", e.target.value)
                  }
                  className={styles.input}
                />
                <input
                  type="time"
                  value={manualTime[day].end}
                  onChange={(e) =>
                    handleManualChange(day, "end", e.target.value)
                  }
                  className={styles.input}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button type="button" className={styles.submitButton} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
