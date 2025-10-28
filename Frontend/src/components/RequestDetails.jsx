import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request] = useState({
    id,
    sender: "John Doe",
    skill: "Python Tutoring",
    date: "2025-10-23",
    message: "I’d like to learn Python basics this weekend.",
  });

  const handleCreateMeeting = () => {
    alert("Meeting created successfully!");
  };

  const handleAccept = () => {
    alert("Request accepted!");
    navigate("/requests");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        className="text-blue-600 mb-4"
        onClick={() => navigate("/requests")}
      >
        ← Back
      </button>

      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {request.skill}
        </h2>
        <p className="text-gray-600">
          <strong>From:</strong> {request.sender}
        </p>
        <p className="text-gray-600">
          <strong>Date:</strong> {request.date}
        </p>
        <p className="text-gray-700 mt-4">{request.message}</p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleCreateMeeting}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Create Meeting
          </button>

          <button
            onClick={handleAccept}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
          >
            Accept Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
