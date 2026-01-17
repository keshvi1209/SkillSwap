import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./index.css";
import EditCanteach from "./components/skills/Editcanteachskill.jsx";
import { toast } from "react-toastify";
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
import { connectSocket, disconnectSocket } from './components/socket/socketService.js';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
 useEffect(() => {
    const email = localStorage.getItem("email");
    let socket;

    if (email) {
      socket = connectSocket(email);

      // 🔥 LISTENER: This runs when someone sends YOU a message
      socket.on("receive_message", (data) => {
        console.log("Message received:", data);
        
        // Trigger the Global Toast
        toast.info(`🔔 New Notification: ${data.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });

    } else {
      console.warn("⚠️ No email found in localStorage");
    }

    // Cleanup: Remove listener and disconnect on unmount
    return () => {
      if (socket) {
        socket.off("receive_message"); // Stop listening to avoid duplicates
      }
      disconnectSocket();
    };
  }, []); // Dependency array remains empty

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthInitializer>
         <ToastContainer position="bottom-right" />
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
