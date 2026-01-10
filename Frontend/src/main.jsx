import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./index.css";
import EditCanteach from "./components/skills/Editcanteachskill.jsx";
import Login from "./pages/auth/Loginpage.jsx";
import Signup from "./pages/auth/Signuppage.jsx";
import Entrypage from "./pages/home/Entrypage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import TeachSkillsPage from "./pages/skills/TeachSkillsPage.jsx";
import LearnSkillsPage from "./pages/skills/LearnSkillsPage.jsx";
import Preference from "./pages/profile/PreferencePage.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import App from "./App.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UserDetail from "./pages/profile/UserDetail.jsx";
import RequestDetails from "./components/requests/RequestDetails.jsx";
import ReceivedRequests from "./components/requests/ReceivedRequests.jsx";
import AvailabilityPage from "./pages/profile/AvailabilityPage.jsx";
import ScheduleCalendar from "./components/booking/ScheduleCalendar.jsx";

function AuthInitializer({ children }) {
  const { setUser } = useAuth();

  useEffect(() => {
    // Check if token already exists in localStorage (from login or OAuth callback)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
        });
      } catch (err) {
        console.error("Token decoding failed", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, [setUser]);

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthInitializer>
          <Routes>
            <Route element={<Entrypage />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/editcanteach" element={<EditCanteach />} />
            <Route path="/teach" element={<TeachSkillsPage />} />
            <Route path="/learn" element={<LearnSkillsPage />} />
            <Route path="/app" element={<App />} />
            <Route path="/userdetail" element={<UserDetail />} />
            <Route path="/RequestDetails/:id" element={<RequestDetails />} />
            <Route path="/ReceivedRequests" element={<ReceivedRequests />} />
            <Route path="/availability" element={<AvailabilityPage />} />
            <Route path="/schedule-calendar" element={<ScheduleCalendar />} />
          </Routes>
        </AuthInitializer>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
