import React, { useState } from "react";
import styles from "./SkillsSummary.module.css";
import Addedskillssummary from "../components/Addedskillssummary.jsx";

function SkillsSummary() {
  const [isOpen, setIsOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isOpen2, setIsOpen2] = useState(false);
  const [skills2, setSkills2] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState(null);

  // ---- Fetch for "Can Teach" ----
  const fetchCanTeachSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/getcanteachskills", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch canTeach skills");
      }

      const data = await response.json();
      console.log("CanTeach API Response:", data);

      if (data.canTeach && Array.isArray(data.canTeach)) {
        setSkills(data.canTeach);
      } else {
        setSkills([]);
        console.warn("Unexpected API response structure for canTeach:", data);
      }
    } catch (error) {
      console.error("Error fetching canTeach skills:", error);
      setError(error.message);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  // ---- Fetch for "Want to Learn" ----
  const fetchToLearnSkills = async () => {
    setLoading2(true);
    setError2(null);
    try {
      const response = await fetch("http://localhost:5000/gettolearnskills", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch toLearn skills");
      }

      const data = await response.json();
      console.log("ToLearn API Response:", data);

      // 👇 Use "toLearn" (not canTeach) if your API sends that
      if (data.toLearn && Array.isArray(data.toLearn)) {
        setSkills2(data.toLearn);
      } else {
        setSkills2([]);
        console.warn("Unexpected API response structure for toLearn:", data);
      }
    } catch (error) {
      console.error("Error fetching toLearn skills:", error);
      setError2(error.message);
      setSkills2([]);
    } finally {
      setLoading2(false);
    }
  };

  // ---- Handlers ----
  const handleClick = () => {
    if (!isOpen && skills.length === 0) {
      fetchCanTeachSkills();
    }
    setIsOpen(!isOpen);
  };

  const handleClick2 = () => {
    if (!isOpen2 && skills2.length === 0) {
      fetchToLearnSkills();
    }
    setIsOpen2(!isOpen2);
  };

  return (
    <div className={styles.maincontainer}>
      {/* ---- Section 1: Can Teach ---- */}
      <div className={styles.skillsSummaryContainer}>
        <p className={styles.value}>Skills that you can teach</p>
        <button className={styles.dropdownButton} onClick={handleClick}>
          {isOpen ? "▲" : "▼"}
        </button>
      </div>

      {isOpen && (
        <div>
          {loading && <p>Loading skills...</p>}
          {error && <p className={styles.error}>Error: {error}</p>}
          {!loading && !error && skills.length === 0 && <p>No skills found.</p>}
          {!loading && !error && skills.length > 0 && (
            <Addedskillssummary skills={skills} />
          )}
        </div>
      )}

      {/* ---- Section 2: To Learn ---- */}
      <div className={styles.skillsSummaryContainer}>
        <p className={styles.value}>Skills that you want to learn</p>
        <button className={styles.dropdownButton} onClick={handleClick2}>
          {isOpen2 ? "▲" : "▼"}
        </button>
      </div>

      {isOpen2 && (
        <div>
          {loading2 && <p>Loading skills...</p>}
          {error2 && <p className={styles.error}>Error: {error2}</p>}
          {!loading2 && !error2 && skills2.length === 0 && (
            <p>No skills found.</p>
          )}
          {!loading2 && !error2 && skills2.length > 0 && (
            <Addedskillssummary skills={skills2} />
          )}
        </div>
      )}
    </div>
  );
}

export default SkillsSummary;
