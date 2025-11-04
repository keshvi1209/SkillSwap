import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./index.css";
import EditCanteach from "./components/Editcanteachskill.jsx";
import Login from "./pages/Loginpage.jsx";
import Signup from "./pages/Signuppage.jsx";
import Entrypage from "./pages/Entrypage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import TeachSkillsPage from "./pages/TeachSkillsPage.jsx";
import LearnSkillsPage from "./pages/LearnSkillsPage.jsx";
import Preference from "./pages/PreferencePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import App from "./App.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UserDetail from "./pages/UserDetail.jsx";
import RequestDetails from "./components/RequestDetails.jsx";
import ReceivedRequests from "./components/ReceivedRequests.jsx";
import AvailabilityPage from "./pages/AvailabilityPage.jsx";

function AuthInitializer({ children }) {
  const { setUser } = useAuth();

  useEffect(() => {
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
  }, []);

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
            <Route path="/RequestDetails" element={<RequestDetails />} />
            <Route path="/ReceivedRequests" element={<ReceivedRequests />} />
            <Route path="/availability" element={<AvailabilityPage/>}/>
          </Routes>
        </AuthInitializer>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
