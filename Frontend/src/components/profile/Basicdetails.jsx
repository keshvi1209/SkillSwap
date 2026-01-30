import { useState, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { User, MapPin, Phone, Building, Save, Mail } from "lucide-react";
import api from "../../services/api";

function Basicdetails() {
  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      return {
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        token,
      };
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }, [token]);

  const [formData, setFormData] = useState({
    contact: "",
    address: "",
    city: "",
    state: "",
  });
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/getupdateddetails/${user.id}`);
        const userData = response.data;

        setFormData({
          contact: userData.contact || "",
          address: userData.address || "",
          city: userData.city || "",
          state: userData.state || "",
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (user?.id && user?.token) {
      fetchUserDetails();
    }
  }, [user?.id, user?.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await api.put("/updatedetails", {
        userId: user.id,
        ...formData,
      });

      setSaveStatus("saved");
    } catch (error) {
      console.error("Error saving details:", error);
      setSaveStatus("error");
    } finally {
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60 backdrop-blur-xl shadow-2xl transition-all hover:shadow-purple-500/10">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6 sm:p-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4 group/avatar">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-40 group-hover/avatar:opacity-75 transition duration-500" />
            <img
              src="https://picsum.photos/150"
              alt="User profile"
              className="relative w-28 h-28 rounded-full object-cover border-2 border-white/20 shadow-xl"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
          <p className="text-gray-400 text-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Active Member
          </p>
        </div>

        {/* Status Message */}
        <div className={`mb-6 text-sm text-center font-medium transition-all duration-300 ${saveStatus === "saving" ? "text-blue-400" :
            saveStatus === "saved" ? "text-green-400" :
              saveStatus === "error" ? "text-red-400" : "opacity-0 translate-y-2"
          }`}>
          {saveStatus === "saving" && "Saving changes..."}
          {saveStatus === "saved" && "Changes saved successfully!"}
          {saveStatus === "error" && "Error saving changes"}
        </div>

        <form className="space-y-5">
          {/* Email Field (Read-only) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-400 focus:outline-none cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {/* Contact Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Phone Number</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-purple-400 transition-colors">
                <Phone size={16} />
              </div>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter contact number"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:bg-gray-800 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Address Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Address</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-purple-400 transition-colors">
                <MapPin size={16} />
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter street address"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:bg-gray-800 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* City Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">City</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-purple-400 transition-colors">
                  <Building size={16} />
                </div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:bg-gray-800 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* State Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">State</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-purple-400 transition-colors">
                  <MapPin size={16} />
                </div>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:bg-gray-800 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="w-full mt-8 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/20"
          >
            {saveStatus === "saving" ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Basicdetails;
