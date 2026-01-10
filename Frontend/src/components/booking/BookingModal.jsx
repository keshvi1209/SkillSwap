import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../../services/api";

const BookingModal = ({ skill, userId, isOpen, onClose, onConfirm }) => {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [upcomingAvailability, setUpcomingAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const response = await api.get(`/getavailability/${userId}`);

      console.log("Availability response:", response.data);

      if (response.data.success) {
        const availabilityData = response.data.data.availability;

        const upcomingDays = generateUpcomingWeek();

        const availabilityWithDates = upcomingDays.map(({ dayName, date }) => {
          const dayAvailability = availabilityData.find(
            (avail) => avail.day === dayName
          );

          const slots = dayAvailability && dayAvailability.slots
            ? dayAvailability.slots.map((slot) => ({
              startTime: slot.startTime,
              endTime: slot.endTime,
              startTime24: slot.startTime24,
              endTime24: slot.endTime24,
              isAvailable: !slot.booked,
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

  const findRecurringSlots = () => {
    const slotMap = new Map();

    upcomingAvailability.forEach(({ dayName, date, slots }) => {
      slots.forEach((slot) => {
        if (slot.isAvailable) {
          const timeKey = `${slot.startTime24}-${slot.endTime24}`;
          if (!slotMap.has(timeKey)) {
            slotMap.set(timeKey, []);
          }
          slotMap.get(timeKey).push({
            day: dayName,
            date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            startTime24: slot.startTime24,
            endTime24: slot.endTime24,
            slotId: slot.slotId,
          });
        }
      });
    });

    return Array.from(slotMap.entries())
      .filter(([_, occurrences]) => occurrences.length >= 2)
      .map(([timeKey, occurrences]) => ({
        timeKey,
        displayTime: occurrences[0].startTime + " - " + occurrences[0].endTime,
        occurrences,
      }));
  };

  const recurringSlots = findRecurringSlots();

  const handleSelectWeekSlot = (occurrences) => {
    setSelectedSlots(occurrences);
  };

  const handleSlotSelect = (slot) => {
    const isAlreadySelected = selectedSlots.some(
      selected => selected.slotId === slot.slotId
    );

    if (isAlreadySelected) {
      setSelectedSlots(selectedSlots.filter(selected => selected.slotId !== slot.slotId));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const isSlotSelected = (slotId) => {
    return selectedSlots.some(selected => selected.slotId === slotId);
  };

  const getSelectedSlotsByDay = () => {
    const grouped = {};
    selectedSlots.forEach(slot => {
      const dayKey = slot.date.toDateString();
      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(slot);
    });
    return grouped;
  };

  const sendBookingToBackend = async (bookingData) => {
    try {
      setIsSubmitting(true);

      console.log('Booking response from backend:', bookingData);
      const response = await api.post('/bookings', bookingData);
      if (response.data.success) {
        console.log('Booking request sent successfully:', response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.message || 'Failed to send booking request');
      }
    } catch (error) {
      console.error('Error sending booking request:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one slot");
      return;
    }

    try {
      let studentId = null;
      let userName = 'Unknown User';
      let userEmail = 'unknown@example.com';

      try {
        const tokenData = localStorage.getItem("token");
        if (tokenData) {
          const user = jwtDecode(tokenData);
          console.log("Decoded user from token:", user);
          studentId = user.userid || user.id;
          userName = user.name || user.username || 'Unknown User';
          userEmail = user.email || 'unknown@example.com';
        } else {
          console.log("Token found:", tokenData);
          studentId = "current-user";
        }
      } catch (error) {
        console.error('Error getting user info from localStorage:', error);
        studentId = "current-user";
      }

      if (!studentId) {
        setError("User ID not found. Please log in again.");
        return;
      }

      if (!userId) {
        setError("Teacher information is missing. Please try again.");
        return;
      }

      const formattedSlots = selectedSlots.map(slot => ({
        day: slot.day,
        date: slot.date instanceof Date ? slot.date.toISOString() : slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        startTime24: slot.startTime24,
        endTime24: slot.endTime24,
        slotId: slot.slotId
      }));

      const bookingData = {
        studentId,
        userName,
        userEmail,
        skillName: skill?.skill || "General Session",
        selectedSlots: formattedSlots,
        message: message.trim() || "",
        teacherId: userId,
        timestamp: new Date().toISOString()
      };

      console.log('Sending booking data:', bookingData);

      const result = await sendBookingToBackend(bookingData);

      if (result.success) {
        onConfirm({
          slots: selectedSlots,
          userId,
          studentId,
          bookingData: result.data
        });

        setSelectedSlots([]);
        setMessage("");

        alert(`Booking request sent successfully! ${selectedSlots.length > 1 ? `(${selectedSlots.length} sessions)` : ''}`);
      }
    } catch (error) {
      console.error('Failed to send booking request:', error);

      let errorMessage = "Failed to send booking request. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 w-full max-w-3xl p-6 rounded-2xl relative shadow-lg overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => {
            onClose();
            setSelectedSlots([]);
            setError("");
            setMessage("");
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 text-2xl w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-100 mb-4">
          Book a Session: {skill?.skill || "Session"}
        </h2>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
              <div className="text-gray-400">Loading availability...</div>
            </div>
          </div>
        )}

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

        {!loading && !error && (
          <>
            {recurringSlots.length > 0 && (
              <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                <h3 className="text-gray-200 font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Quick Book - Recurring Time Slots
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recurringSlots.map(({ timeKey, displayTime, occurrences }) => {
                    const isSelected = selectedSlots.length > 0 &&
                      selectedSlots.some(slot =>
                        slot.startTime24 === occurrences[0].startTime24
                      );

                    return (
                      <button
                        key={timeKey}
                        onClick={() => handleSelectWeekSlot(occurrences)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${isSelected
                          ? "bg-teal-600 border-teal-400 text-white shadow-lg scale-105"
                          : "bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-teal-500"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{displayTime}</span>
                          <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">
                            {occurrences.length} days
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Select a recurring slot to book it for all available days in the week
                </p>
              </div>
            )}

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
                          const isSelected = isSlotSelected(slot.slotId);
                          const isDisabled = !slot.isAvailable;

                          return (
                            <button
                              key={slot.slotId || idx}
                              onClick={() => {
                                if (!isDisabled) {
                                  handleSlotSelect({
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
                                ${isDisabled
                                  ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                                  : isSelected
                                    ? "bg-teal-600 border-teal-400 text-white shadow-lg"
                                    : "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 hover:border-gray-600"
                                }`}
                            >
                              {slot.startTime} - {slot.endTime}
                              {isSelected && (
                                <span className="ml-1">✓</span>
                              )}
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

            {selectedSlots.length > 0 && (
              <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                <p className="text-teal-400 text-sm font-semibold mb-2">
                  Selected {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''}:
                </p>
                <div className="space-y-2">
                  {Object.entries(getSelectedSlotsByDay()).map(([dayKey, daySlots]) => (
                    <div key={dayKey} className="text-teal-300 text-sm">
                      <div className="font-medium mb-1">
                        {daySlots[0].day}, {daySlots[0].date.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex flex-wrap gap-2 ml-2">
                        {daySlots.map((slot, idx) => (
                          <span
                            key={slot.slotId}
                            className="text-teal-200 text-xs bg-teal-500/10 px-2 py-1 rounded"
                          >
                            {slot.startTime} - {slot.endTime}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mb-6 mt-5">
          <label className="block text-gray-300 font-medium mb-2">
            Optional Message to the Teacher:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a short note (e.g., topic, preference, or question)..."
            rows={1}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              onClose();
              setSelectedSlots([]);
              setError("");
              setMessage("");
            }}
            className="px-5 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedSlots.length === 0 || loading || isSubmitting}
            className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {selectedSlots.length > 1 ?
              `Request ${selectedSlots.length} Sessions` :
              'Request Session'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;