import { useState } from "react";

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

function AvailabilityCard({ closeCard, saveAvailability, initialData }) {
  const transformInitialData = (data) => {
    if (!data || !data.availability) return [];

    const flatSlots = [];
    data.availability.forEach((dayAvailability) => {
      dayAvailability.slots.forEach((slot) => {
        flatSlots.push({
          day: dayAvailability.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          startTime24: slot.startTime24,
          endTime24: slot.endTime24,
        });
      });
    });
    return flatSlots;
  };

  const [availability, setAvailability] = useState(
    transformInitialData(initialData) || []
  );
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

  const getSlotsForDay = (day) => {
    return availability.filter((slot) => slot.day === day);
  };

  const hasTimeOverlap = (newSlot, existingSlots) => {
    const newStart = convertTo24hr(newSlot.startTime);
    const newEnd = convertTo24hr(newSlot.endTime);

    for (const existingSlot of existingSlots) {
      const existingStart = convertTo24hr(existingSlot.startTime);
      const existingEnd = convertTo24hr(existingSlot.endTime);

      if (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        return true;
      }
    }
    return false;
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

    const startTime24 = convertTo24hr(startTime);
    const endTime24 = convertTo24hr(endTime);

    if (startTime24 >= endTime24) {
      alert("End time must be after start time");
      return;
    }

    let newSlots = [];

    if (isDailySame) {
      newSlots = allDays.map((day) => ({
        day,
        startTime,
        endTime,
        startTime24,
        endTime24,
      }));
    } else {
      const newSlot = {
        day,
        startTime,
        endTime,
        startTime24,
        endTime24,
      };

      const existingSlots = getSlotsForDay(day);
      if (hasTimeOverlap(newSlot, existingSlots)) {
        alert(
          `Time slot overlaps with existing slot for ${day}. Please choose a different time.`
        );
        return;
      }

      newSlots.push(newSlot);
    }

    if (newSlots.length === 0) {
      alert("No new slots to add.");
      return;
    }

    const updated = [...availability, ...newSlots];
    setAvailability(sortAvailability(updated));

    setSlot((prev) => ({
      ...prev,
      startHour: "",
      startMinute: "",
      endHour: "",
      endMinute: "",
      ...(isDailySame ? {} : { day: prev.day }),
    }));
  };

  const removeSlot = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const transformToMongoFormat = (flatSlots) => {
    const dayMap = {};

    flatSlots.forEach((slot) => {
      if (!dayMap[slot.day]) {
        dayMap[slot.day] = {
          day: slot.day,
          slots: [],
        };
      }

      dayMap[slot.day].slots.push({
        startTime: slot.startTime,
        endTime: slot.endTime,
        startTime24: slot.startTime24,
        endTime24: slot.endTime24,
        booked: false,
        bookedBy: null,
      });
    });

    // Sort slots within each day by start time
    Object.values(dayMap).forEach((dayAvailability) => {
      dayAvailability.slots.sort((a, b) =>
        a.startTime24.localeCompare(b.startTime24)
      );
    });

    return Object.values(dayMap);
  };

  const handleSave = () => {
    if (availability.length === 0) {
      alert("Please add at least one availability slot");
      return;
    }

    const mongoFormat = {
      availability: transformToMongoFormat(availability),
    };

    // ✅ Added console log to preview final MongoDB-ready data
    console.log(
      "🧾 Final data being saved to MongoDB format:",
      JSON.stringify(mongoFormat, null, 2)
    );

    saveAvailability(mongoFormat);
  };

  const groupedSlots = availability.reduce((acc, slot) => {
    if (!acc[slot.day]) {
      acc[slot.day] = [];
    }
    acc[slot.day].push(slot);
    return acc;
  }, {});

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
      <label className="block text-sm font-semibold text-white mb-3">
        {label}
      </label>
      <div className="flex gap-3">
        <select
          name={hourName}
          value={hourValue}
          onChange={onChange}
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition-all duration-200 backdrop-blur-lg"
        >
          <option value="" className="bg-[#1a1a2e]">
            Hour
          </option>
          {generateTimeOptions("hour").map((h) => (
            <option key={h} value={h} className="bg-[#1a1a2e]">
              {h}
            </option>
          ))}
        </select>

        <select
          name={minuteName}
          value={minuteValue}
          onChange={onChange}
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition-all duration-200 backdrop-blur-lg"
        >
          <option value="" className="bg-[#1a1a2e]">
            Minute
          </option>
          {generateTimeOptions("minute").map((m) => (
            <option key={m} value={m} className="bg-[#1a1a2e]">
              {m}
            </option>
          ))}
        </select>

        <select
          name={periodName}
          value={periodValue}
          onChange={onChange}
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition-all duration-200 backdrop-blur-lg"
        >
          {generateTimeOptions("period").map((p) => (
            <option key={p} value={p} className="bg-[#1a1a2e]">
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Manage Your Time Slots
        </h2>
        <p className="text-gray-300">
          Add and manage your teaching availability
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <label className="block text-sm font-semibold text-white mb-3">
              Select Day
            </label>
            <select
              name="day"
              value={slot.day}
              onChange={handleChange}
              disabled={isDailySame}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition-all duration-200 backdrop-blur-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" className="bg-[#1a1a2e]">
                Choose a day
              </option>
              {allDays.map((day) => (
                <option key={day} value={day} className="bg-[#1a1a2e]">
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="grid grid-cols-1 gap-6">
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

            <div className="flex items-center pt-4 mt-4 border-t border-white/10">
              <input
                id="daily-same"
                name="isDailySame"
                type="checkbox"
                checked={isDailySame}
                onChange={handleChange}
                className="h-5 w-5 text-[#6C63FF] border-white/20 rounded focus:ring-2 focus:ring-[#6C63FF] bg-white/5"
              />
              <label
                htmlFor="daily-same"
                className="ml-3 text-sm font-medium text-white"
              >
                Apply same schedule to all weekdays
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={addSlot}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#6C63FF] to-[#4a3fdb] text-white font-semibold rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-1 focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
          >
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {isDailySame ? "Add Weekly Schedule" : "Add Time Slot"}
            </div>
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Your Schedule</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">
                {availability.length} slot{availability.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {availability.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">
                  No time slots added yet. Start by adding your first
                  availability slot.
                </p>
              </div>
            ) : (
              Object.entries(groupedSlots).map(([day, slots]) => (
                <div
                  key={day}
                  className="bg-white/5 rounded-xl border border-white/10 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-[#6C63FF] text-sm uppercase tracking-wide">
                      {day}
                    </h4>
                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg">
                      {slots.length} session{slots.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {slots.map((slot, index) => {
                      const globalIndex = availability.findIndex(
                        (s) =>
                          s.day === slot.day &&
                          s.startTime === slot.startTime &&
                          s.endTime === slot.endTime
                      );
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gradient-to-r from-[#6C63FF]/10 to-purple-500/10 border border-[#6C63FF]/20 rounded-lg px-4 py-3 group hover:border-[#6C63FF]/40 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-[#6C63FF] rounded-full"></div>
                            <span className="text-white font-medium text-sm">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSlot(globalIndex)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 font-bold text-lg transition-all duration-200 p-1 hover:bg-red-500/10 rounded"
                            aria-label="Remove slot"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-8 mt-8 border-t border-white/10">
        <button
          type="button"
          onClick={closeCard}
          className="px-8 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-2xl transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5 backdrop-blur-lg"
        >
          Cancel
        </button>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300">
            {availability.length} time slot
            {availability.length !== 1 ? "s" : ""} configured
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={availability.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-lg"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvailabilityCard;
