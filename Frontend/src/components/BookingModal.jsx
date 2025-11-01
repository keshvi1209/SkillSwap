import { useState, useEffect } from "react";
import api from "../api";

const BookingModal = ({ skill, userId, isOpen, onClose, onConfirm }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [upcomingAvailability, setUpcomingAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserAvailability();
    }
  }, [isOpen, userId]);

  const fetchUserAvailability = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching availability for userId:", userId);

      // Make API call to get user availability
      const response = await api.get(`/getavailability/${userId}`);
      
      console.log("Availability response:", response.data);

      if (response.data.success) {
        const availabilityData = response.data.data.availability;
        
        // Generate upcoming week
        const upcomingDays = generateUpcomingWeek();
        
        // Map availability to upcoming days
        const availabilityWithDates = upcomingDays.map(({ dayName, date }) => {
          // Find availability for this day from the dayAvailabilitySchema
          const dayAvailability = availabilityData.find(
            (avail) => avail.day === dayName
          );
          
          // Extract slots from the nested structure
          const slots = dayAvailability && dayAvailability.slots
            ? dayAvailability.slots.map((slot) => ({
                startTime: slot.startTime,
                endTime: slot.endTime,
                startTime24: slot.startTime24,
                endTime24: slot.endTime24,
                isAvailable: !slot.booked, // Not booked means available
                slotId: slot._id,
                bookedBy: slot.bookedBy,
              }))
            : [];
          
          return { dayName, date, slots };
        });
        
        setUpcomingAvailability(availabilityWithDates);
      }
    } catch (err) {
      console.error("Error fetching availability:", err);
      setError(
        err.response?.data?.message || 
        "Failed to load availability. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const generateUpcomingWeek = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      days.push({ date, dayName });
    }
    return days;
  };

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedSlot) {
      alert("Please select a slot");
      return;
    }
    
    // Pass the complete slot info including slotId for booking
    onConfirm({
      ...selectedSlot,
      userId, // Include userId for the booking
    });
    
    setSelectedSlot(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 w-full max-w-3xl p-6 rounded-2xl relative shadow-lg overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => {
            onClose();
            setSelectedSlot(null);
            setError("");
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 text-2xl w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-100 mb-4">
          Book a Session: {skill?.skill || "Session"}
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
              <div className="text-gray-400">Loading availability...</div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={fetchUserAvailability}
              className="mt-2 text-teal-400 hover:text-teal-300 text-sm underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Availability Grid */}
        {!loading && !error && (
          <>
            {upcomingAvailability.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingAvailability.map(({ dayName, date, slots }) => (
                  <div key={date.toISOString()} className="border border-gray-700 rounded-lg p-3">
                    <h3 className="text-gray-300 font-semibold mb-2">
                      {dayName},{" "}
                      {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </h3>
                    {slots.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {slots.map((slot, idx) => {
                          const isSelected =
                            selectedSlot?.day === dayName &&
                            selectedSlot?.slotId === slot.slotId;

                          const isDisabled = !slot.isAvailable;

                          return (
                            <button
                              key={slot.slotId || idx}
                              onClick={() => {
                                if (!isDisabled) {
                                  setSelectedSlot({
                                    day: dayName,
                                    date,
                                    startTime: slot.startTime,
                                    endTime: slot.endTime,
                                    startTime24: slot.startTime24,
                                    endTime24: slot.endTime24,
                                    slotId: slot.slotId,
                                  });
                                }
                              }}
                              disabled={isDisabled}
                              className={`px-3 py-1.5 rounded border text-sm transition-colors duration-200
                                ${
                                  isDisabled
                                    ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50 line-through"
                                    : isSelected
                                    ? "bg-teal-600 border-teal-400 text-white shadow-lg"
                                    : "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 hover:border-gray-600"
                                }`}
                            >
                              {slot.startTime} - {slot.endTime}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">No slots available</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No availability found for this user.</p>
              </div>
            )}

            {/* Selected Slot Info */}
            {selectedSlot && (
              <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                <p className="text-teal-400 text-sm">
                  <span className="font-semibold">Selected:</span> {selectedSlot.day},{" "}
                  {selectedSlot.date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  at {selectedSlot.startTime} - {selectedSlot.endTime}
                </p>
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              onClose();
              setSelectedSlot(null);
              setError("");
            }}
            className="px-5 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedSlot || loading}
            className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Request to Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;