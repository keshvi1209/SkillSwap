import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "../../components/layout/Header.jsx";
import api from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ProfileHeader from "../../components/profile/ProfileHeader";
import TabNavigation from "../../components/layout/TabNavigation";
import TeachTab from "../../components/skills/TeachTab";
import LearnTab from "../../components/skills/LearnTab";
import ReviewsTab from "../../components/reviews/ReviewsTab";
import { getSocket } from "../../components/socket/socketService";
import { toast } from "react-toastify";
// 1. IMPORT ICONS
import { X, Send } from "lucide-react";

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("teach");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // --- CHAT STATES ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const chatEndRef = useRef(null);

  const location = useLocation();
  const userId = location.state?.user;
  const token = localStorage.getItem("token");

  // Get current logged in user ID for chat alignment
  const currentUserToken = token ? jwtDecode(token) : null;
  // const currentUserId = currentUserToken?.id;
  const currentUserName = currentUserToken?.name;
  const currentUserEmail = currentUserToken?.email;

  const mockFeedback = [
    {
      id: 1,
      userId: 123,
      userName: "Alex Johnson",
      rating: 5,
      comment: "Excellent teacher! Explained complex concepts in a very understandable way.",
      date: "2023-10-15",
    },
    {
      id: 2,
      userId: 124,
      userName: "Maria Garcia",
      rating: 4,
      comment: "Very knowledgeable and patient. Would recommend to others.",
      date: "2023-09-22",
    },
  ];

  const fetchUserDetails = async (id) => {
    try {
      const response = await api.get(`/getusercompletedetails/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    } else if (token) {
      const decoded = jwtDecode(token);
      fetchUserDetails(decoded.id);
    }
  }, [userId, token]);

  // --- FETCH CHAT HISTORY ---
  useEffect(() => {
    if (isChatOpen && user?.email && currentUserToken) {
      const fetchHistory = async () => {
        try {
          const res = await api.get(`/chat/messages/${user.email}`);
          // Map to local state structure
          const mappedMessages = res.data.map(msg => ({
            message: msg.content,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMe: msg.senderEmail === currentUserToken.email
          }));
          setMessages(mappedMessages);
        } catch (err) {
          console.error("Failed to load history", err);
        }
      };
      fetchHistory();
    }
  }, [isChatOpen, user, currentUserToken?.email]);

  // --- AUTO SCROLL TO BOTTOM OF CHAT ---
  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  // --- SOCKET LISTENER FOR INCOMING MESSAGES ---
  useEffect(() => {
    const socket = getSocket();

    // We only want to add the message to the list if the chat window is OPEN
    // and the message is actually meant for this conversation
    const handleReceiveMessage = (data) => {
      if (isChatOpen && data.fromEmail === user.email) {
        setMessages((prev) => [...prev, {
          message: data.message,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: false
        }]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [isChatOpen, user?.email]);


  const handleSubmitFeedback = (feedback) => {
    console.log("Submitting feedback:", feedback);
    alert("Thank you for your feedback!");
    setShowFeedbackForm(false);
  };

  const calculateAverageRating = () => {
    if (!mockFeedback.length) return 0;
    const total = mockFeedback.reduce((sum, item) => sum + item.rating, 0);
    return total / mockFeedback.length;
  };

  // --- OPEN CHAT UI ---
  const handleMessageClick = () => {
    if (!user || !user.email) {
      toast.error("User email not found!");
      return;
    }
    setIsChatOpen(true);
  };

  // --- SEND MESSAGE LOGIC ---
  const handleSendMessage = () => {
    if (currentMessage.trim() === "") return;

    const socket = getSocket();

    // Emit to server
    socket.emit("send_message", {
      fromName: currentUserName,
      fromEmail: currentUserToken.email,
      toEmail: user.email,
      message: currentMessage
    });

    // Add to local state (Optimistic UI)
    const newMessage = {
      message: currentMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true, // Mark as sent by me
    };

    setMessages((prev) => [...prev, newMessage]);
    setCurrentMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-16 relative">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <ProfileHeader
          user={user}
          averageRating={calculateAverageRating()}
          reviewCount={mockFeedback.length}
          onMessageClick={handleMessageClick} // Triggers the Drawer
        />

        <section className="mt-8 bg-gradient-to-br from-gray-800/80 to-gray-800/50 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden backdrop-blur-sm">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            teachCount={user.canTeach ? user.canTeach.length : 0}
            learnCount={user.toLearn ? user.toLearn.length : 0}
            reviewCount={mockFeedback.length}
          />

          <div className="p-6 sm:p-8">
            {activeTab === "teach" && (
              <TeachTab skills={user.canTeach} userId={userId} />
            )}
            {activeTab === "learn" && (
              <LearnTab skills={user.toLearn} />
            )}
            {activeTab === "reviews" && (
              <ReviewsTab
                feedbacks={mockFeedback}
                showFeedbackForm={showFeedbackForm}
                onToggleFeedbackForm={() => setShowFeedbackForm(!showFeedbackForm)}
                onSubmitFeedback={handleSubmitFeedback}
              />
            )}
          </div>
        </section>
      </main>

      {/* ------------------------------------------- */}
      {/* CHAT DRAWER OVERLAY          */}
      {/* ------------------------------------------- */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all duration-300">
          <div className="w-full md:w-96 bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-300">

            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 backdrop-blur">
              <div>
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  Chat
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </h3>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                  {user.name}
                </p>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-900/50">
              {/* Intro Message */}
              <div className="flex justify-center mb-6">
                <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
                  Start of conversation with {user.name}
                </span>
              </div>

              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`p-4 rounded-2xl text-sm max-w-[85%] border ${msg.isMe
                        ? "bg-indigo-600 text-white rounded-tr-none border-indigo-500"
                        : "bg-slate-800 text-slate-200 rounded-tl-none border-slate-700/50"
                      }`}
                  >
                    <p className="break-words">{msg.message}</p>
                    {msg.time && (
                      <p className={`text-[10px] mt-1 text-right ${msg.isMe ? "text-indigo-200" : "text-slate-500"}`}>
                        {msg.time}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
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
  );
};

export default UserDetail;