import { useState, useEffect, useMemo } from "react";
import {jwtDecode} from "jwt-decode";
import api from "../api";

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
        token 
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
    
        if (response.ok) {
          const userData = await response.json();
          setFormData({
            contact: userData.contact || "",
            address: userData.address || "",
            city: userData.city || "",
            state: userData.state || "",
          });
        }
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
      const response = await fetch("http://localhost:5000/updatedetails", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user.id, ...formData }),
      });

      if (response.ok) {
        setSaveStatus("saved");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving details:", error);
      setSaveStatus("error");
    } finally {
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-5 md:p-10 max-w-4xl text-gray-200">
      <div className="flex flex-col items-center mb-8 text-center bg-gradient-to-r from-blue-900 to-purple-900 p-2 rounded-lg">
        <img
          src="https://picsum.photos/150"
          alt="User profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-md"
        />
        <p className="text-3xl font-semibold mt-4 text-white">{user?.name}</p>
      </div>

      <div
        className={`mb-4 text-sm text-center transition-opacity duration-300 ${
          saveStatus === "saving"
            ? "text-blue-400"
            : saveStatus === "saved"
            ? "text-green-400"
            : saveStatus === "error"
            ? "text-red-400"
            : "opacity-0"
        }`}
      >
        {saveStatus === "saving" && "Saving changes..."}
        {saveStatus === "saved" && "Changes saved successfully!"}
        {saveStatus === "error" && "Error saving changes. Please try again."}
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed"
            value={user?.email || ""}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Contact Number
          </label>
          <input
            type="tel"
            name="contact"
            className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-800 text-gray-200"
            placeholder="Enter your contact number"
            value={formData.contact}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-gray-200"
            placeholder="Enter your street address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-800 text-gray-200"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              State
            </label>
            <input
              type="text"
              name="state"
              className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-gray-200"
              placeholder="Enter your state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full mt-6 py-3 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 cursor-pointer text-white"
          disabled={saveStatus === "saving"}
        >
          {saveStatus === "saving" ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default Basicdetails;
