import { useState } from "react";

// Helper Functions for Time
const convertTo24hr = (time12) => {
  if (!time12) return "";
  const [time, period] = time12.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (period === "PM" && hour !== 12) {
    hour += 12;
  } else if (period === "AM" && hour === 12) {
    hour = 0;
  }

  const hour24 = String(hour).padStart(2, "0");
  const minute24 = String(minute).padStart(2, "0");
  return `${hour24}:${minute24}`;
};

const generateTimeOptions = (type) => {
  const options = [];
  if (type === "hour") {
    for (let i = 1; i <= 12; i++) {
      options.push(String(i));
    }
  } else if (type === "minute") {
    for (let i = 0; i < 60; i += 5) {
      options.push(String(i).padStart(2, "0"));
    }
  } else if (type === "period") {
    options.push("AM", "PM");
  }
  return options;
};

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function AvailabilityCard({ closeCard, saveAvailability }) {
  const [availability, setAvailability] = useState([]);
  const [isDailySame, setIsDailySame] = useState(false);
  const [slot, setSlot] = useState({
    day: "",
    startHour: "",
    startMinute: "",
    startPeriod: "AM",
    endHour: "",
    endMinute: "",
    endPeriod: "PM",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setIsDailySame(checked);
      if (checked) {
        setSlot((prev) => ({ ...prev, day: "" }));
      }
    } else {
      setSlot((prev) => ({ ...prev, [name]: value }));
    }
  };

  const sortAvailability = (list) => {
    const dayIndex = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    };

    return list.sort((a, b) => {
      const daySort = dayIndex[a.day] - dayIndex[b.day];
      if (daySort !== 0) return daySort;

      const timeA = convertTo24hr(a.startTime);
      const timeB = convertTo24hr(b.startTime);
      return timeA.localeCompare(timeB);
    });
  };

  const addSlot = () => {
    const {
      day,
      startHour,
      startMinute,
      startPeriod,
      endHour,
      endMinute,
      endPeriod,
    } = slot;

    if (
      !startHour ||
      !startMinute ||
      !endHour ||
      !endMinute ||
      (!isDailySame && !day)
    ) {
      alert("Please fill all required fields");
      return;
    }

    const startTime = `${startHour}:${startMinute} ${startPeriod}`;
    const endTime = `${endHour}:${endMinute} ${endPeriod}`;

    let newSlots = [];

    if (isDailySame) {
      // Create slots for all days
      const existingDays = new Set(availability.map((a) => a.day));
      newSlots = allDays
        .filter((day) => !existingDays.has(day))
        .map((day) => ({ 
          day, 
          startTime, 
          endTime,
          startTime24: convertTo24hr(startTime),
          endTime24: convertTo24hr(endTime)
        }));
    } else {
      // Check for existing slot on the same day
      const existingSlot = availability.find((a) => a.day === day);
      if (existingSlot) {
        alert(
          `A slot for ${day} already exists. Please remove it first or select a different day.`
        );
        return;
      }
      newSlots.push({ 
        day, 
        startTime, 
        endTime,
        startTime24: convertTo24hr(startTime),
        endTime24: convertTo24hr(endTime)
      });
    }

    if (newSlots.length === 0) {
      alert("No new slots to add. All days might already have slots.");
      return;
    }

    const updated = [...availability, ...newSlots];
    setAvailability(sortAvailability(updated));

    // Reset time inputs but keep day if not daily same
    setSlot((prev) => ({
      ...prev,
      startHour: "",
      startMinute: "",
      endHour: "",
      endMinute: "",
      ...(isDailySame ? {} : { day: "" }),
    }));
  };

  const removeSlot = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (availability.length === 0) {
      alert("Please add at least one availability slot");
      return;
    }
    
    // Pass the availability data back to Canteach component
    saveAvailability(availability);
  };

  // Time Input Component
  const TimeInput = ({
    label,
    hourName,
    minuteName,
    periodName,
    hourValue,
    minuteValue,
    periodValue,
    onChange,
  }) => (
    <div className="flex flex-col">
      <label className="block text-sm font-semibold text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <select
          name={hourName}
          value={hourValue}
          onChange={onChange}
          className="flex-1 px-3 py-2 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition-all duration-200"
        >
          <option value="" className="bg-[#2d2d37]">
            Hr
          </option>
          {generateTimeOptions("hour").map((h) => (
            <option key={h} value={h} className="bg-[#2d2d37]">
              {h}
            </option>
          ))}
        </select>

        <select
          name={minuteName}
          value={minuteValue}
          onChange={onChange}
          className="flex-1 px-3 py-2 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition-all duration-200"
        >
          <option value="" className="bg-[#2d2d37]">
            Min
          </option>
          {generateTimeOptions("minute").map((m) => (
            <option key={m} value={m} className="bg-[#2d2d37]">
              {m}
            </option>
          ))}
        </select>

        <select
          name={periodName}
          value={periodValue}
          onChange={onChange}
          className="flex-1 px-3 py-2 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition-all duration-200"
        >
          {generateTimeOptions("period").map((p) => (
            <option key={p} value={p} className="bg-[#2d2d37]">
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    // ADDED THE MISSING CONTAINER DIV
    <div className="bg-[rgba(25,25,35,0.95)] rounded-2xl shadow-2xl border border-white/10 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h3 className="text-xl font-bold text-white text-center">
          Set Your Availability
        </h3>
        <p className="text-gray-400 text-sm text-center mt-1">
          Add your available time slots
        </p>
      </div>

      {/* Form */}
      <div className="p-6 space-y-4">
        {/* Day Selection */}
        <div className="flex flex-col">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Select Day
          </label>
          <select
            name="day"
            value={slot.day}
            onChange={handleChange}
            disabled={isDailySame}
            className="w-full px-4 py-3 bg-[rgba(45,45,55,0.7)] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" className="bg-[#2d2d37]">
              Select Day
            </option>
            {allDays.map((day) => (
              <option key={day} value={day} className="bg-[#2d2d37]">
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-1 gap-4">
          <TimeInput
            label="Start Time"
            hourName="startHour"
            minuteName="startMinute"
            periodName="startPeriod"
            hourValue={slot.startHour}
            minuteValue={slot.startMinute}
            periodValue={slot.startPeriod}
            onChange={handleChange}
          />

          <TimeInput
            label="End Time"
            hourName="endHour"
            minuteName="endMinute"
            periodName="endPeriod"
            hourValue={slot.endHour}
            minuteValue={slot.endMinute}
            periodValue={slot.endPeriod}
            onChange={handleChange}
          />
        </div>

        {/* Daily Same Checkbox */}
        <div className="flex items-center pt-2">
          <input
            id="daily-same"
            name="isDailySame"
            type="checkbox"
            checked={isDailySame}
            onChange={handleChange}
            className="h-4 w-4 text-[#6C63FF] border-white/20 rounded focus:ring-[#6C63FF] bg-[rgba(45,45,55,0.7)]"
          />
          <label
            htmlFor="daily-same"
            className="ml-3 text-sm font-medium text-gray-300"
          >
            Apply same time to all days
          </label>
        </div>

        {/* Add Slot Button */}
        <button
          type="button"
          onClick={addSlot}
          className="w-full px-4 py-3 bg-gradient-to-r from-[#6C63FF] to-[#4a3fdb] text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
        >
          {isDailySame ? "Add Daily Slots" : "Add Time Slot"}
        </button>
      </div>

      {/* Slots List */}
      <div className="px-6 pb-4">
        <h4 className="text-sm font-bold text-gray-300 mb-3">
          Current Slots ({availability.length})
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {availability.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              No slots added yet
            </p>
          ) : (
            availability.map((a, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-[rgba(108,99,255,0.1)] border border-[#6C63FF]/20 rounded-lg px-4 py-3"
              >
                <div className="text-white text-sm">
                  <span className="font-semibold text-[#6C63FF]">
                    {a.day.substring(0, 3)}
                  </span>
                  : {a.startTime} - {a.endTime}
                </div>
                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  className="text-red-400 hover:text-red-300 font-bold text-lg transition-colors duration-200"
                  aria-label="Remove slot"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between p-6 border-t border-white/10">
        <button
          type="button"
          onClick={closeCard}
          className="px-6 py-2 bg-[rgba(45,45,55,0.7)] border border-white/10 text-white font-medium rounded-xl transition-all duration-200 hover:bg-[rgba(55,55,65,0.8)] hover:-translate-y-0.5"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={availability.length === 0}
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Save Availability
        </button>
      </div>
    </div>
  );
}

export default AvailabilityCard;