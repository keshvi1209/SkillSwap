import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const allFields = [
  "Art",
  "Cooking",
  "Design",
  "Languages",
  "Mathematics",
  "Music",
  "Programming",
  "Science",
  "Sports",
  "Photography",
  "Writing",
  "Dancing",
  "Yoga",
  "Finance",
  "Public Speaking",
].sort();

const fields = [...allFields, "Other"];

const LearnSkillsPage = ({ setUserData }) => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const toggleField = (field) => {
    setSelected(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const handleNext = () => {
    if (selected.length === 0) {
      alert("Please select at least one skill to learn!");
      return;
    }
    // setUserData(prev => ({ ...prev, learning: selected }));
    navigate("/teach");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>
          Which subjects or fields are you excited to dive into and <span style={styles.highlight}>learn</span> more about? 
        </h2>
        <div style={styles.grid}>
          {fields.map((field) => (
            <div
              key={field}
              onClick={() => toggleField(field)}
              style={{
                ...styles.card,
                backgroundColor: selected.includes(field) ? "#4a90e2" : "#f0f4f8", // Bright blue for selected, light grey-blue for unselected
                color: selected.includes(field) ? "#fff" : "#334e68", // White for selected, dark grey-blue for unselected
                boxShadow: selected.includes(field)
                  ? "0 8px 20px rgba(74, 144, 226, 0.3)" // Blue shadow for selected
                  : "0 4px 10px rgba(0,0,0,0.08)", // Softer shadow for unselected
                transform: selected.includes(field) ? "translateY(-3px)" : "translateY(0)",
                border: selected.includes(field) ? "2px solid #357ABD" : "2px solid #e1e8ed", // Darker blue border for selected, lighter for unselected
              }}
            >
              {field}
            </div>
          ))}
        </div>
        <button onClick={handleNext} style={styles.button}>Next</button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1f283d, #2f3e58, #435b7a)", // Darker, more appealing blue-grey gradient
    padding: "20px",
  },
  container: {
    padding: "40px 30px",
    maxWidth: "900px",
    width: "100%",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "35px",
    color: "#2c3e50", // Darker, more sophisticated text color
    lineHeight: "1.3",
  },
  highlight: {
    color: "#4a90e2", // Matching the new primary blue
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
  },
  card: {
    padding: "10px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    textAlign: "center",
    userSelect: "none",
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: "40px",
    padding: "12px 40px",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#4a90e2", // Matching the new primary blue
    color: "#fff",
    fontWeight: "700",
    transition: "background-color 0.3s",
    boxShadow: "0 4px 15px rgba(74, 144, 226, 0.4)", // Blue shadow for button
  },
};

export default LearnSkillsPage;