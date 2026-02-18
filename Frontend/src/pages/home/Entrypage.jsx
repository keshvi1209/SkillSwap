import React from "react";
import { Outlet, Navigate } from "react-router-dom";

function Entrypage() {
  const token = localStorage.getItem("token");
  const safeParse = (data) => {
    try {
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Error parsing localStorage data:", e);
      return null;
    }
  };

  const toLearn = safeParse(localStorage.getItem("toLearnPreferences")); // array
  const canTeach = safeParse(localStorage.getItem("canTeachPreferences")); // array

  console.log("toLearn:", toLearn);
  console.log("canTeach:", canTeach);


  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default Entrypage;
