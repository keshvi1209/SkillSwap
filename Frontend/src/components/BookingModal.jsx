import { useState, useEffect } from "react";

const BookingModal = ({ skill, user, isOpen, onClose, onConfirm }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [upcomingAvailability, setUpcomingAvailability] = useState([]);

  useEffect(() => {
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

    const upcomingDays = generateUpcomingWeek();

    const availabilityWithDates = upcomingDays.map(({ dayName, date }) => {
      const slots =
        skill.availability?.filter((slot) => slot.day === dayName) || [];
      return { dayName, date, slots };
    });

    setUpcomingAvailability(availabilityWithDates);
  }, [skill]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedSlot) return alert("Please select a slot");
    onConfirm(selectedSlot);
    setSelectedSlot(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 w-full max-w-3xl p-6 rounded-2xl relative shadow-lg overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => {
            onClose();
            setSelectedSlot(null);
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-100"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-100 mb-4">
          Book a Session: {skill.skill}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingAvailability.map(({ dayName, date, slots }) => (
            <div key={date} className="border border-gray-700 rounded-lg p-3">
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
                      selectedSlot?.startTime === slot.startTime;

                    const isDisabled = !slot.isAvailable;

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedSlot({
                              day: dayName,
                              date,
                              startTime: slot.startTime,
                              endTime: slot.endTime,
                            });
                          }
                        }}
                        disabled={isDisabled} // 👈 disable unavailable slots
                        className={`px-3 py-1.5 rounded border text-sm transition-colors duration-200
        ${
          isDisabled
            ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50"
            : isSelected
            ? "bg-teal-600 border-teal-400 text-white"
            : "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
        }`}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <span className="text-sm text-gray-500">No slots</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              onClose();
              setSelectedSlot(null);
            }}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-500"
          >
            Request to book
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
