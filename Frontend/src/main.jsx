import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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
import ProtectedRoute from "./ProtectedRoute.jsx";
import {
  connectSocket,
  disconnectSocket,
} from "./components/socket/socketService.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chatpage from "./pages/chat/ChatPage.jsx";
import HistoryPage from "./pages/history/HistoryPage.jsx";
import NotFound from "./pages/Not-found.jsx";
import PublicRoute from "./PublicRoute.jsx";
function AuthInitializer({ children }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

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
    const email = user?.email || localStorage.getItem("email");
    let socket;

    if (email) {
      socket = connectSocket(email);

      // 🔥 LISTENER: This runs when someone sends YOU a message
      socket.on("receive_message", (data) => {
        console.log("Message received:", data.fromName, data.message);

        const isChatPage = window.location.pathname.startsWith("/chat");
        if (!window.location.href.includes(data.fromEmail)) {
          console.log("🔔 Showing toast for:", data.fromName);
          toast.info(
            <div>
              <p>Message from {data.fromName}</p>
              {/* <p style={{ fontSize: '12px', margin: '5px 0' }}>{data.message.substring(0, 40)}...</p> */}
              <button
                onClick={() => navigate("/chat")}
                style={{
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",

                  marginTop: "4px",
                }}
              >
                View message
              </button>
            </div>,
            {
              position: "bottom-right",
              autoClose: 5000,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              icon: false,
            },
          );
        } else {
          console.log(
            "🔕 Suppressing toast because user is on chat page for:",
            data.fromEmail,
          );
        }
      });
    }

    // Cleanup: Remove listener and disconnect on unmount or when user changes
    return () => {
      if (socket) {
        socket.off("receive_message");
      }
      disconnectSocket();
    };
  }, [user]);

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthInitializer>
          <ToastContainer
            position="bottom-right"
            theme="dark"
            style={{ zIndex: 9999 }}
          />
          <Routes>
             <Route element={<Entrypage />}>
                <Route path="/" element={<HomePage />} />
              </Route>
            <Route element={<PublicRoute />}>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<ProtectedRoute />}>
             
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
              <Route path="/chat" element={<Chatpage />} />
              <Route path="/sessions" element={<HistoryPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthInitializer>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
