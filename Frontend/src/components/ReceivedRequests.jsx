import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ReceivedRequests = () => {
  const navigate = useNavigate();

  const [requests] = useState([
    {
      id: 1,
      sender: "John Doe",
      skill: "Python Tutoring",
      date: "2025-10-23",
      message: "I’d like to learn Python basics this weekend.",
    },
    {
      id: 2,
      sender: "Sarah Lee",
      skill: "Web Development",
      date: "2025-10-22",
      message: "Need a session on React fundamentals.",
    },
  ]);

  const handleViewDetails = (id) => {
    navigate(`/requests/${id}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Received Requests
      </h1>
      <div className="grid gap-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white shadow-md rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition cursor-pointer"
            onClick={() => handleViewDetails(req.id)}
          >
            <h2 className="text-lg font-semibold text-gray-700">
              {req.sender}
            </h2>
            <p className="text-sm text-gray-500">{req.skill}</p>
            <p className="text-xs text-gray-400 mt-1">{req.date}</p>
            <p className="text-sm text-gray-600 mt-2 truncate">
              {req.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceivedRequests;
