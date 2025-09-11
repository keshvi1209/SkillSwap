import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Basicdetails() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    contact: "",
    address: "",
    city: "",
    state: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(""); // For showing save status

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getupdateddetails/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("Fetched user details:", userData);
          setFormData({
            contact: userData.contact || "",
            address: userData.address || "",
            city: userData.city || "",
            state: userData.state || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.token) {
      fetchUserDetails();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    if (!isLoading) {
      const saveData = async () => {
        setSaveStatus("saving");
        try {
          const response = await fetch("http://localhost:5000/updatedetails", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              userId: user.id,
              ...formData
            }),
          });

          if (response.ok) {
            console.log("Details saved successfully");
            setSaveStatus("saved");
            // Clear status after 2 seconds
            setTimeout(() => setSaveStatus(""), 2000);
          } else {
            throw new Error("Failed to save");
          }
        } catch (error) {
          console.error("Error saving details:", error);
          setSaveStatus("error");
          // Clear status after 2 seconds
          setTimeout(() => setSaveStatus(""), 2000);
        }
      };

      const timeoutId = setTimeout(saveData, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [formData, user, isLoading]);

  // if (isLoading) {
  //   return (
  //     <div className="bg-gray-900 rounded-xl shadow-lg p-5 md:p-10 max-w-4xl font-sans text-gray-200 flex justify-center items-center h-64">
  //       <p className="text-xl">Loading user details...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-5 md:p-10 max-w-4xl font-sans text-gray-200">
      <div className="flex flex-col items-center mb-8 text-center bg-gradient-to-r from-blue-900 to-purple-900 p-2 rounded-lg">
        <img
          src="https://picsum.photos/150"
          alt="User profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-md"
        />
        <p className="text-3xl font-semibold mt-4 text-white">
          {user?.name}
        </p>
      </div>

      {/* Save Status Indicator */}
      <div className={`mb-4 text-sm text-center transition-opacity duration-300 ${
        saveStatus === "saving" ? "text-blue-400" : 
        saveStatus === "saved" ? "text-green-400" : 
        saveStatus === "error" ? "text-red-400" : "opacity-0"
      }`}>
        {saveStatus === "saving" && "Saving changes..."}
        {saveStatus === "saved" && "Changes saved successfully!"}
        {saveStatus === "error" && "Error saving changes. Please try again."}
      </div>

      <form className="space-y-6">
        {/* Name Input Group
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 bg-gray-800 text-gray-500 cursor-not-allowed"
            value={user?.name || ""}
            readOnly
          />
        </div> */}

        {/* Email Input Group */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 bg-gray-800 text-gray-500 cursor-not-allowed"
            value={user?.email || ""}
            readOnly
          />
        </div>

        {/* Contact Number Input Group */}
        <div>
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Contact Number
          </label>
          <input
            id="contact"
            type="tel"
            name="contact"
            className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-300 bg-gray-800 text-gray-200"
            placeholder="Enter your contact number"
            value={formData.contact}
            onChange={handleChange}
          />
        </div>

        {/* Address Input Group */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Address
          </label>
          <input
            id="address"
            type="text"
            name="address"
            className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 bg-gray-800 text-gray-200"
            placeholder="Enter your street address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* City and State Group */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* City Input Group */}
          <div className="flex-1">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              City
            </label>
            <input
              id="city"
              type="text"
              name="city"
              className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-300 bg-gray-800 text-gray-200"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          {/* State Input Group */}
          <div className="flex-1">
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              State
            </label>
            <input
              id="state"
              type="text"
              name="state"
              className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 bg-gray-800 text-gray-200"
              placeholder="Enter your state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Basicdetails;