import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

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
    alert("Please select at least one skill you want to learn!");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const response = await fetch(`http://localhost:5000/canteachpreferences/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ preferences: selected }),
    });

    // ✅ Safe JSON parsing
    let data = {};
    try {
      data = await response.json();
    } catch {
      console.warn("No JSON returned from server");
    }

    if (!response.ok) {
      const msg = data?.message || `Request failed with status ${response.status}`;
      throw new Error(msg);
    }

    navigate("/app");
  } catch (error) {
    console.error("Error saving toLearn skills:", error.message);
    alert("Failed to save skills. Try again!");
  }
};


  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>
          Which topics or areas are you an expert in?
        </h2>
        <div style={styles.grid}>
          {fields.map((field) => (
            <div
              key={field}
              onClick={() => toggleField(field)}
              style={{
                ...styles.card,
                backgroundColor: selected.includes(field) ? "#4a90e2" : "#f0f4f8",
                color: selected.includes(field) ? "#fff" : "#334e68",
                border: selected.includes(field)
                  ? "2px solid #357ABD"
                  : "2px solid #e1e8ed",
              }}
            >
              {field}
            </div>
          ))}
        </div>
        <button onClick={handleNext} style={styles.button}>
          Finish
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, #1f283d, #2f3e58, #435b7a)", padding: "20px" },
  container: { padding: "40px 30px", maxWidth: "900px", width: "100%", textAlign: "center", backgroundColor: "#fff", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  heading: { fontSize: "28px", fontWeight: "600", marginBottom: "35px", color: "#2c3e50" },
  grid: { display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center" },
  card: { padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600", fontSize: "14px", userSelect: "none", transition: "all 0.3s ease" },
  button: { marginTop: "40px", padding: "12px 40px", fontSize: "18px", borderRadius: "12px", border: "none", backgroundColor: "#4a90e2", color: "#fff", fontWeight: "700", cursor: "pointer" },
};

export default TeachSkillsPage;
