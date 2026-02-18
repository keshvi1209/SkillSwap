import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AvailabilityCard from "../../components/booking/AvailabilityCard";
import api from "../../services/api";

function AvailabilityPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "create"; // create | edit

  const userId = localStorage.getItem("userid");

  const [currentAvailability, setCurrentAvailability] = useState([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ✅ Fetch availability only in edit mode
  useEffect(() => {
    if (!userId) {
      navigate("/app");
      return;
    }

    if (mode === "edit") {
      fetchAvailability();
    }
  }, [mode, userId]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/getavailability/${userId}`);
      console.log("Availability API Response:", response.data);

      if (!response.data?.data?.availability) {
        // If edit mode but no data exists → redirect to create
        navigate("/availability?mode=create");
        return;
      }

      setCurrentAvailability(response.data.data.availability);
    } catch (err) {
      if (err.response?.status === 404) {
        // If availability not found → redirect to create
        navigate("/availability?mode=create");
      } else {
        console.error("Error fetching availability:", err);
        setError("Failed to load availability");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (availabilityData) => {
    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const payload = {
        ...availabilityData,
        user: userId,
      };

      if (mode === "edit") {
        await api.put(`/updateavailability/${userId}`, payload);
      } else {
        await api.post("/saveavailability", payload);
      }

      setCurrentAvailability(availabilityData.availability);
      setSuccess(true);

      // Optional: auto switch to edit mode after create
      if (mode === "create") {
        navigate("/availability?mode=edit", { replace: true });
      }
    } catch (err) {
      console.error("Save failed:", err);
      setError(err.response?.data?.message || "Failed to save availability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8">
      {/* Back Button */}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-center">
          {mode === "edit"
            ? "✅ Availability updated successfully!"
            : "✅ Availability created successfully!"}
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-8 flex-row flex">
        <button
          onClick={() => navigate("/app")}
          className="mb-12 text-gray-300 hover:text-white transition"
        >
          ← Back to Dashboard
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === "edit"
              ? "Edit Your Availability"
              : "Set Your Availability"}
          </h1>
          <p className="text-gray-300">
            {mode === "edit"
              ? "Modify your existing time slots"
              : "Add your available time slots"}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-gray-400 py-20">
          Loading availability...
        </div>
      ) : (
        <div className="max-w-5xl mx-auto bg-[#1e1e2e] p-6 rounded-xl border border-gray-700">
          <AvailabilityCard
            closeCard={() => navigate("/app")}
            saveAvailability={handleSave}
            initialData={{ availability: currentAvailability }}
            mode={mode}
          />
        </div>
      )}
    </div>
  );
}

export default AvailabilityPage;
