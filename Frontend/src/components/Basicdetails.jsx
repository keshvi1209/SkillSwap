import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Basicdetails() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 md:p-10 max-w-4xl font-sans text-gray-800">
      
      <div className="flex flex-col items-center mb-8 text-center bg-[#faf5ef] p-2 ">
        <img
          src="https://picsum.photos/150"
          alt="User profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
        />
        <p className="text-3xl font-semibold mt-4 text-gray-900">
          {user?.name}
        </p>
      </div>

      {/* Form for user details */}
      <form className="space-y-6">
        {/* Email Input Group */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 bg-gray-100 text-gray-600 cursor-not-allowed"
            placeholder="Enter your email"
            value={user?.email || ""}
            readOnly
          />
        </div>

        {/* Contact Number Input Group */}
        <div>
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contact Number
          </label>
          <input
            id="contact"
            type="tel"
            name="contact"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            placeholder="Enter your contact number"
            required
          />
        </div>

        {/* Address Input Group */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <input
            id="address"
            type="text"
            name="address"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            placeholder="Enter your street address"
            required
          />
        </div>

        {/* City and State Group */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* City Input Group */}
          <div className="flex-1">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City
            </label>
            <input
              id="city"
              type="text"
              name="city"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              placeholder="Enter your city"
              required
            />
          </div>

          {/* State Input Group */}
          <div className="flex-1">
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State
            </label>
            <input
              id="state"
              type="text"
              name="state"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              placeholder="Enter your state"
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Basicdetails;
