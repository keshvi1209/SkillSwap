import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api"; // ✅ import axios instance

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

const TeachSkillsPage = ({ setUserData }) => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const toggleField = (field) => {
    setSelected((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleNext = async () => {
    if (selected.length === 0) {
      alert("Please select at least one skill you can teach!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in again.");
        navigate("/login");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // ✅ Axios PATCH request
      const response = await api.patch(`/canteachpreferences/${userId}`, {
        preferences: selected,
      });

      const data = response.data;

      // ✅ Save to localStorage
      localStorage.setItem(
        "canTeachPreferences",
        JSON.stringify(data.canTeachPreferences)
      );

      // ✅ Update parent state if passed
      if (setUserData) {
        setUserData((prev) => ({
          ...prev,
          canTeachPreferences: data.canTeachPreferences,
        }));
      }

      navigate("/"); // ✅ redirect to homepage
    } catch (error) {
      console.error("Error saving canTeach skills:", error);
      const msg = error.response?.data?.message || "Failed to save skills. Try again!";
      alert(msg);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.backgroundElements}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
        <div style={styles.circle3}></div>
        <div style={styles.circle4}></div>
        <div style={styles.floatingShape1}></div>
        <div style={styles.floatingShape2}></div>
        <div style={styles.floatingShape3}></div>
        <div style={styles.particle}></div>
        <div style={styles.particle2}></div>
        <div style={styles.particle3}></div>
        <div style={styles.particle4}></div>
        <div style={styles.particle5}></div>
      </div>

      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>What skills can you teach others?</h2>
          <p style={styles.subheading}>
            Select topics where you have expertise (choose at least one)
          </p>
        </div>

        <div style={styles.grid}>
          {fields.map((field) => (
            <div
              key={field}
              onClick={() => toggleField(field)}
              style={{
                ...styles.card,
                backgroundColor: selected.includes(field)
                  ? "#4CAF50"
                  : "rgba(45, 45, 55, 0.7)",
                color: selected.includes(field) ? "#fff" : "#e0e0e0",
                boxShadow: selected.includes(field)
                  ? "0 4px 12px rgba(76, 175, 80, 0.5)"
                  : "0 2px 8px rgba(0,0,0,0.3)",
                transform: selected.includes(field) ? "translateY(-2px)" : "none",
                border: selected.includes(field)
                  ? "1px solid rgba(76, 175, 80, 0.5)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
                position: "relative",
              }}
            >
              {field}
              {selected.includes(field) && (
                <span style={styles.checkmark}>✓</span>
              )}
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <p style={styles.selectionText}>
            {selected.length} {selected.length === 1 ? "skill" : "skills"} selected
          </p>
          <button
            onClick={handleNext}
            style={{
              ...styles.button,
              opacity: selected.length === 0 ? 0.7 : 1,
              cursor: selected.length === 0 ? "not-allowed" : "pointer",
            }}
            disabled={selected.length === 0}
            className="skill-select-button"
          >
            Continue
            <span style={styles.arrow}>→</span>
          </button>
        </div>
      </div>

      {/* animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes move {
            0% { transform: translateY(0) translateX(0) rotate(0deg); }
            25% { transform: translateY(-30px) translateX(20px) rotate(90deg); }
            50% { transform: translateY(0) translateX(40px) rotate(180deg); }
            75% { transform: translateY(30px) translateX(20px) rotate(270deg); }
            100% { transform: translateY(0) translateX(0) rotate(360deg); }
          }
          @keyframes drift {
            0% { transform: translateX(0) translateY(0); }
            100% { transform: translateX(100px) translateY(50px); }
          }
          .skill-select-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(76, 175, 80, 0.6);
          }
          .skill-select-button:hover span {
            transform: translateX(3px);
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: "relative",
    overflow: "hidden",
    color: "#e0e0e0",
  },
  backgroundElements: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 },
  // ✅ rest of your styles unchanged...
  container: {
    padding: "40px 30px",
    maxWidth: "900px",
    width: "100%",
    textAlign: "center",
    backgroundColor: "rgba(25, 25, 35, 0.9)",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    backdropFilter: "blur(10px)",
    position: "relative",
    zIndex: 1,
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  header: { marginBottom: "40px" },
  heading: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "12px",
    background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subheading: { fontSize: "16px", color: "#a0a0a0" },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
  },
  card: {
    padding: "8px 16px",
    borderRadius: "15px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    userSelect: "none",
    transition: "all 0.2s ease",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100px",
    height: "48px",
    border: "1px solid #ccc",
  },
  checkmark: { position: "absolute", top: "5px", right: "8px", fontSize: "14px", fontWeight: "bold" },
  footer: { marginTop: "50px", display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" },
  selectionText: { fontSize: "16px", color: "#a0a0a0" },
  button: {
    padding: "14px 32px",
    fontSize: "16px",
    borderRadius: "50px",
    border: "none",
    background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.4)",
  },
  arrow: { transition: "transform 0.2s ease" },
};

export default TeachSkillsPage;
