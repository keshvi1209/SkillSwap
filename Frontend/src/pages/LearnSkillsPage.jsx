import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
    setSelected((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  // In your LearnSkillsPage handleNext function, replace the localStorage line:

  const handleNext = async () => {
    if (selected.length === 0) {
      alert("Please select at least one skill you want to learn!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await fetch(
        `http://localhost:5000/tolearnpreferences/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ preferences: selected }),
        }
      );

      let data = {};
      try {
        data = await response.json();
      } catch {
        console.warn("No JSON returned from server");
      }

      if (!response.ok) {
        const msg =
          data?.message || `Request failed with status ${response.status}`;
        throw new Error(msg);
      }

      // FIXED: Store the user object properly
      localStorage.setItem("toLearnPreferences", JSON.stringify(data.toLearnPreferences));

      navigate("/teach");
    } catch (error) {
      console.error("Error saving toLearn skills:", error.message);
      alert("Failed to save skills. Try again!");
    }
  };
  return (
    <div style={styles.wrapper}>
      {/* Animated background elements */}
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
          <h2 style={styles.heading}>What would you like to learn?</h2>
          <p style={styles.subheading}>
            Select topics that interest you (choose at least one)
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
                  ? "#6C63FF"
                  : "rgba(45, 45, 55, 0.7)",
                color: selected.includes(field) ? "#fff" : "#e0e0e0",
                boxShadow: selected.includes(field)
                  ? "0 4px 12px rgba(108, 99, 255, 0.5)"
                  : "0 2px 8px rgba(0,0,0,0.3)",
                transform: selected.includes(field)
                  ? "translateY(-2px)"
                  : "none",
                border: selected.includes(field)
                  ? "1px solid rgba(108, 99, 255, 0.5)"
                  : "1px solid rgba(255, 255, 255, 0.1)",
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
            {selected.length} {selected.length === 1 ? "skill" : "skills"}{" "}
            selected
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

      {/* Inject CSS animations */}
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
          
          .floating {
            animation: float 8s ease-in-out infinite;
          }
          
          .pulse {
            animation: pulse 6s ease-in-out infinite;
          }
          
          .rotate {
            animation: rotate 20s linear infinite;
          }
          
          .move {
            animation: move 15s ease-in-out infinite;
          }
          
          .drift {
            animation: drift 12s ease-in-out infinite alternate;
          }
          
          .skill-select-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(108, 99, 255, 0.6);
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
    background:
      "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: "relative",
    overflow: "hidden",
    color: "#e0e0e0",
  },
  backgroundElements: {
    position: "Absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  circle1: {
    position: "absolute",
    top: "10%",
    left: "5%",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(108, 99, 255, 0.15) 0%, rgba(74, 63, 219, 0.15) 100%)",
    filter: "blur(20px)",
    animation: "pulse 8s ease-in-out infinite",
  },
  circle2: {
    position: "absolute",
    bottom: "15%",
    right: "10%",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(108, 99, 255, 0.12) 0%, rgba(74, 63, 219, 0.12) 100%)",
    filter: "blur(15px)",
    animation: "float 12s ease-in-out infinite",
  },
  circle3: {
    position: "absolute",
    top: "50%",
    left: "70%",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(74, 63, 219, 0.1) 100%)",
    filter: "blur(10px)",
    animation: "rotate 25s linear infinite",
  },
  circle4: {
    position: "absolute",
    bottom: "5%",
    left: "20%",
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(108, 99, 255, 0.12) 0%, rgba(74, 63, 219, 0.12) 100%)",
    filter: "blur(12px)",
    animation: "pulse 10s ease-in-out infinite",
  },
  floatingShape1: {
    position: "absolute",
    top: "15%",
    right: "15%",
    width: "100px",
    height: "100px",
    background:
      "linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(74, 63, 219, 0.1) 100%)",
    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    animation: "float 15s ease-in-out infinite",
  },
  floatingShape2: {
    position: "absolute",
    bottom: "20%",
    left: "15%",
    width: "80px",
    height: "80px",
    background:
      "linear-gradient(135deg, rgba(108, 99, 255, 0.08) 0%, rgba(74, 63, 219, 0.08) 100%)",
    clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
    animation: "move 18s ease-in-out infinite",
  },
  floatingShape3: {
    position: "absolute",
    top: "70%",
    right: "25%",
    width: "120px",
    height: "120px",
    background:
      "linear-gradient(135deg, rgba(108, 99, 255, 0.06) 0%, rgba(74, 63, 219, 0.06) 100%)",
    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    animation: "rotate 30s linear infinite",
  },
  particle: {
    position: "absolute",
    top: "30%",
    left: "10%",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "rgba(108, 99, 255, 0.2)",
    animation: "drift 20s ease-in-out infinite alternate",
  },
  particle2: {
    position: "absolute",
    top: "60%",
    left: "80%",
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    backgroundColor: "rgba(74, 63, 219, 0.15)",
    animation: "drift 15s ease-in-out infinite alternate-reverse",
  },
  particle3: {
    position: "absolute",
    top: "20%",
    left: "40%",
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    backgroundColor: "rgba(108, 99, 255, 0.15)",
    animation: "drift 18s ease-in-out infinite alternate",
  },
  particle4: {
    position: "absolute",
    top: "80%",
    left: "60%",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "rgba(74, 63, 219, 0.18)",
    animation: "drift 22s ease-in-out infinite alternate-reverse",
  },
  particle5: {
    position: "absolute",
    top: "40%",
    left: "30%",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "rgba(108, 99, 255, 0.12)",
    animation: "drift 16s ease-in-out infinite alternate",
  },
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
  header: {
    marginBottom: "40px",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#ffffff",
    background: "linear-gradient(135deg, #6C63FF 0%, #4a3fdb 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subheading: {
    fontSize: "16px",
    color: "#a0a0a0",
    fontWeight: "400",
    margin: "0",
  },
  grid: {
    display: "flex",
    flexDirection: "row",
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
    width: "fit-content",
    minWidth: "100px", // ⬅️ ensures a minimum size
    height: "48px", // consistent height
    whiteSpace: "nowrap",
    border: "1px solid #ccc",
  },
  checkmark: {
    position: "absolute",
    top: "5px",
    right: "8px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  footer: {
    marginTop: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  selectionText: {
    fontSize: "16px",
    color: "#a0a0a0",
    margin: "0",
  },
  button: {
    padding: "14px 32px",
    fontSize: "16px",
    borderRadius: "50px",
    border: "none",
    background: "linear-gradient(135deg, #6C63FF 0%, #4a3fdb 100%)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(108, 99, 255, 0.4)",
  },
  arrow: {
    transition: "transform 0.2s ease",
  },
};

export default LearnSkillsPage;
