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
    const token = searchParams.get("token");

    if (token) {
      try {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        localStorage.setItem("id", decoded.id);
        localStorage.setItem("name", decoded.name);
        localStorage.setItem("email", decoded.email);
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Error decoding token from URL:", error);
        alert("Login failed: Invalid token received");
      }
    }
  }, [searchParams, navigate]);

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
        throw new Error("Token missing");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Unauthorized: Invalid email or password");
      } else {
        alert("Login failed: " + (error.response?.status || error.message));
      }
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000";
    console.log("Backend URL:", BACKEND);
    window.location.href = `${BACKEND}/auth/login`;
  };

  return (
    <form className="w-full" onSubmit={login_submit}>
      {/* Header - Hidden on desktop since it's in the page */}
      <div className="hidden lg:block mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400 text-sm">
          Sign in to access your personalized dashboard.
        </p>
      </div>

      {/* Email Input */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type="email"
            className="block w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            className="block w-full pl-11 pr-11 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300 transition-colors" />
            ) : (
              <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300 transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between mb-8">
        <label className="flex items-center cursor-pointer group">
          <div className="relative">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${rememberMe ? "bg-indigo-600 border-indigo-600" : "bg-gray-800 border-gray-600 group-hover:border-gray-500"
              }`}>
              {rememberMe && <Check size={12} className="text-white" />}
            </div>
          </div>
          <span className="ml-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Remember me
          </span>
        </label>

        <a
          href="#"
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader className="animate-spin h-5 w-5" />
            <span>Signing in...</span>
          </div>
        ) : (
          "Sign In"
        )}
      </button>

      {/* Divider */}
      <div className="mt-8 mb-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-800 text-gray-500 bg-opacity-0 backdrop-blur-sm">
              Or continue with
            </span>
          </div>
        </div>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          className="w-full flex justify-center items-center py-3 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-white font-medium rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          onClick={handleLogin}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </form>
  );
}

export default Login;