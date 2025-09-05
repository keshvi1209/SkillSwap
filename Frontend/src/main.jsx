import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Loginpage.jsx";
import Signup from "./pages/Signuppage.jsx";
import App from "./App.jsx";
import "./index.css";
import Entrypage from "./pages/Entrypage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { jwtDecode } from "jwt-decode";
import EditCanteach from "./components/Editcanteachskill.jsx";

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
    <AuthProvider>
      <AuthInitializer>
        <BrowserRouter>
          <Routes>
            <Route element={<Entrypage />}>
              <Route path="/" element={<App />} />
            </Route>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/editcanteach" element={<EditCanteach />} />
          </Routes>
        </BrowserRouter>
      </AuthInitializer>
    </AuthProvider>
  </StrictMode>
);
