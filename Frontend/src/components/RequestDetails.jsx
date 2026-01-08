import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api from "../api.js"; // Ensure this axios instance has baseURL set
import {
  Calendar,
  MessageSquare,
  Video,
  CheckCircle,
  ArrowLeft,
  Scissors,
  Send,
  PlusCircle,
  X,
  Loader2,
} from "lucide-react";

// Use Environment Variable for URL, fallback to localhost
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const RequestDetails = () => {
  const { id } = useParams(); // Using request ID as Room ID
  const navigate = useNavigate();
  const location = useLocation();
  
  // Robust ID check
  const userId =
    localStorage.getItem("id") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("_id");

  // --- STATES ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  // Chat States
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const socketRef = useRef(null); 
  const chatEndRef = useRef(null);

  const request = location.state?.request || {
    studentName: "Student Name",
    studentEmail: "student@example.com",
    status: "pending",
    message: "Request message...",
    skillName: "Skill",
    selectedSlots: [],
  };

  const selectedSkill = request.skillName || "Skill";

  // --- WEBSOCKET & HISTORY CONNECTION ---
  useEffect(() => {
    // 1. Initialize Socket
    socketRef.current = io(SOCKET_URL);

    // 2. Join Room
    socketRef.current.emit("join_room", id);

    // 3. Listen for Messages
    socketRef.current.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // 4. Listen for Connection Errors
    socketRef.current.on("connect_error", (err) => {
      console.error("Socket Connection Error:", err);
    });

    // 5. FETCH HISTORY FROM DB (Crucial Step)
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chats/${id}`);
        if (res.data) {
          setMessages(res.data);
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };
    fetchHistory();

    // Cleanup
    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  // --- AUTO SCROLL ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatOpen]);

  // --- HANDLERS ---
  const handleSendMessage = async () => {
    if (currentMessage.trim() === "") return;

    if (!userId) {
      alert("Error: User ID missing. Please log in again.");
      return;
    }

    const messageData = {
      room: id,
      authorId: userId,
      authorName: "Teacher", // You might want to fetch real name from localStorage
      message: currentMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Emit to Server
    await socketRef.current.emit("send_message", messageData);

    // Optimistic UI Update (Show instantly)
    setMessages((list) => [...list, messageData]);
    setCurrentMessage("");
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  // --- DATE HELPER ---
  const getNextDate = (dayName, timeString) => {
    const days = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
    const targetDay = days[dayName];
    if (targetDay === undefined) return null;
    
    const date = new Date();
    const currentDay = date.getDay();
    let daysUntil = (targetDay + 7 - currentDay) % 7;
    if (daysUntil === 0) daysUntil = 0; // Or 7 for next week
    
    date.setDate(date.getDate() + daysUntil);
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") hours = "00";
    if (modifier === "PM") hours = parseInt(hours, 10) + 12;
    
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
  };

  const handleScheduleMeeting = async () => {
    if (!request.selectedSlots || request.selectedSlots.length === 0) {
      alert("No time slot available to schedule.");
      return;
    }
    const slot = request.selectedSlots[0];
    const startDate = getNextDate(slot.day, slot.startTime);
    const endDate = getNextDate(slot.day, slot.endTime);
    
    if (!startDate || !endDate) {
      alert("Could not parse date/time.");
      return;
    }

    setIsScheduling(true);
    try {
      const res = await api.post("/meet/schedule", {
        summary: `Class: ${selectedSkill} with ${request.studentName}`,
        description: request.message,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        studentEmail: request.studentEmail,
        studentId: request.studentId,
        skillName: selectedSkill,
      });
      alert(`✅ Meeting Scheduled!\nLink: ${res.data.meetLink}`);
    } catch (error) {
      console.error("Scheduling Failed:", error);
      alert("Failed to schedule meeting.");
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center font-sans text-slate-200">
      <div className="w-full max-w-5xl bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-800 flex flex-col md:flex-row min-h-[600px] max-h-[90vh] relative">
        
        {/* LEFT PANEL */}
        <div className="md:w-1/3 bg-slate-800/40 p-8 flex flex-col justify-between border-r border-slate-800">
          <div className="space-y-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-400 hover:text-indigo-400 transition-colors text-sm group"
            >
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            <div className="flex flex-col items-center md:items-start space-y-4">
              <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-xl ring-4 ring-slate-900/50">
                <span className="text-2xl font-black text-white">
                  {request.studentName?.charAt(0) || "S"}
                </span>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {request.studentName}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {request.studentEmail}
                </p>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.15em]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse" />
                {request.status}
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-10">
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-700/40 hover:bg-slate-700 text-white border border-slate-600/50 rounded-xl transition-all font-semibold"
            >
              <MessageSquare size={18} />
              <span>Open Chat</span>
            </button>
            <button
              onClick={() => navigate("/requests/new")}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl transition-all font-semibold shadow-lg shadow-indigo-600/10"
            >
              <PlusCircle size={18} />
              <span>New Request</span>
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-8 md:p-12 flex flex-col overflow-y-auto">
          <div className="mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80 mb-2">
              Selected Skill
            </h3>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                <Scissors size={24} />
              </div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                {selectedSkill}
              </h1>
            </div>
          </div>

          <div className="space-y-8 flex-1">
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">
                Availability
              </h3>
              {request.selectedSlots?.length > 0 ? (
                request.selectedSlots.map((slot, index) => (
                  <div key={slot.slotId || index} className="flex items-center p-5 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                    <div className="p-2 bg-slate-700/30 rounded-lg mr-4 text-slate-400">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white">{slot.day}</p>
                      <p className="text-sm text-slate-400 font-medium">
                        {slot.startTime} — {slot.endTime}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic">No slots selected.</p>
              )}
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-800 grid grid-cols-2 gap-4">
            <button
              onClick={handleScheduleMeeting}
              disabled={isScheduling}
              className="flex items-center justify-center space-x-2 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold transition-all border border-slate-700 disabled:opacity-50"
            >
              {isScheduling ? <Loader2 size={18} className="animate-spin" /> : <Video size={18} />}
              <span>{isScheduling ? "Scheduling..." : "Schedule Class"}</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20">
              <CheckCircle size={18} />
              <span>Accept Request</span>
            </button>
          </div>
        </div>

        {/* --- OVERLAY CHAT DRAWER --- */}
        {isChatOpen && (
          <div className="absolute inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all duration-300">
            <div className="w-full md:w-96 bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-300">
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 backdrop-blur">
                <div>
                  <h3 className="font-bold text-white text-lg">Chat</h3>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                    {request.studentName}
                  </p>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-900/50">
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none text-sm text-slate-200 max-w-[85%] border border-slate-700/50">
                    <p className="mb-1 text-xs text-indigo-400 font-bold">{request.studentName}</p>
                    Hello! I'm interested in the {selectedSkill} class.
                  </div>
                </div>

                {messages.map((msg, index) => {
                  const isMe = msg.authorId === userId;
                  return (
                    <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`p-4 rounded-2xl text-sm max-w-[85%] border ${
                        isMe ? "bg-indigo-600 text-white rounded-tr-none border-indigo-500" : "bg-slate-800 text-slate-200 rounded-tl-none border-slate-700/50"
                      }`}>
                        <p className="break-words">{msg.message}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? "text-indigo-200" : "text-slate-500"}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-6 bg-slate-900 border-t border-slate-800">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-transform active:scale-95"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetails;