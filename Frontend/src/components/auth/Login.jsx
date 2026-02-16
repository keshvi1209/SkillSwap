import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Mail, Lock, Eye, EyeOff, Loader, Check } from "lucide-react";
import api from "../../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("Google Client ID missing");
      return;
    }

    const interval = setInterval(() => {
      if (window.google && window.google.accounts) {
        const codeClient = window.google.accounts.oauth2.initCodeClient({
          client_id: clientId,

          // 🔥 IMPORTANT: Request calendar scope
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar",

          access_type: "offline", // needed for refresh token
          prompt: "consent", // forces refresh token first time
          ux_mode: "popup",

          callback: async (response) => {
            try {
              if (!response.code) {
                console.error("No auth code received");
                return;
              }

              // 🔥 Send authorization code to backend
              const res = await api.post("/auth/google", {
                code: response.code,
              });

              const data = res.data;

              if (data.token) {
                localStorage.setItem("token", data.token);

                const decoded = jwtDecode(data.token);
                localStorage.setItem("userid", decoded.id);
                localStorage.setItem("name", decoded.name);
                localStorage.setItem("email", decoded.email);

                navigate("/");
              } else {
                alert("Token not returned from backend");
              }
            } catch (error) {
              console.error("Google login error:", error);
              alert("Google login failed");
            }
          },
        });

        // 🔥 Attach click to your existing button div
        const googleBtn = document.getElementById("googleBtn");

        if (googleBtn) {
          googleBtn.onclick = () => {
            codeClient.requestCode();
          };
        }

        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);

  /* ============================
     EMAIL / PASSWORD LOGIN
  ============================ */
  const login_submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/login", { email, password });
      const data = response.data;

      if (data.token) {
        localStorage.setItem("token", data.token);

        const decoded = jwtDecode(data.token);
        localStorage.setItem("userid", decoded.id);
        localStorage.setItem("name", decoded.name);
        localStorage.setItem("email", decoded.email);

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        navigate("/");
      } else {
        alert("Token not found in response");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Unauthorized: Invalid email or password");
      } else {
        alert("Login failed");
      }
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full" onSubmit={login_submit}>
      {/* Email */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="email"
            className="block w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            className="block w-full pl-11 pr-11 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between mb-8">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-400">Remember me</span>
        </label>

        <a href="#" className="text-sm text-indigo-400">
          Forgot password?
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader className="animate-spin h-5 w-5" />
            Signing in...
          </div>
        ) : (
          "Sign In"
        )}
      </button>

      {/* Divider */}
      <div className="mt-8 mb-6 text-center text-gray-500">
        Or continue with
      </div>

      {/* Google Button Rendered Here */}
      <button
        type="button"
        id="googleBtn"
        className="w-full py-3 bg-white text-black font-semibold rounded-xl"
      >
        Continue with Google
      </button>

      {/* Signup */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400">
            Sign up now
          </Link>
        </p>
      </div>
    </form>
  );
}

export default Login;
