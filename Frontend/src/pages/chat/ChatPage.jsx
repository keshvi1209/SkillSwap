import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, ChevronLeft } from "lucide-react";
import Header from "../../components/layout/Header";
import { useAuth } from "../../context/AuthContext";
import { getSocket } from "../../components/socket/socketService";
import api from "../../services/api";

const ChatPage = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    const handleReceiveMessage = (data) => {
      if (activeChat && data.fromEmail === activeChat.email) {
        setMessages((prev) => [
          ...prev,
          {
            senderEmail: data.fromEmail,
            receiverEmail: user.email,
            content: data.message,
            createdAt: new Date().toISOString(),
            senderName: data.fromName,
          },
        ]);
      }
      updateConversationOnNewMessage(data.fromEmail, data.message, data.fromName);
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [activeChat, user?.email]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await api.get("/chat/conversations");
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to load chats", err);
    }
  };

  const handleChatSelect = async (chat) => {
    setActiveChat(chat);
    try {
      const res = await api.get(`/chat/messages/${chat.email}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const updateConversationOnNewMessage = (email, text, name) => {
    setConversations((prev) => {
      const existingIndex = prev.findIndex((c) => c.email === email);
      let updatedConversations = [...prev];
      if (existingIndex > -1) {
        const updatedChat = {
          ...updatedConversations[existingIndex],
          lastMessage: text,
          lastMessageTime: new Date().toISOString(),
        };
        updatedConversations.splice(existingIndex, 1);
        updatedConversations.unshift(updatedChat);
      } else {
        updatedConversations.unshift({
          email,
          name,
          lastMessage: text,
          lastMessageTime: new Date().toISOString(),
        });
      }
      return updatedConversations;
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    const socket = getSocket();
    const msgData = {
      fromName: user.name,
      fromEmail: user.email,
      toEmail: activeChat.email,
      message: messageInput,
    };

    socket.emit("send_message", msgData);

    const newMessage = {
      senderEmail: user.email,
      receiverEmail: activeChat.email,
      content: messageInput,
      createdAt: new Date().toISOString(),
      senderName: user.name,
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-screen bg-gray-950 flex flex-col font-sans text-gray-200 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <Header />

      <main className="flex-1 flex max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 gap-6 relative z-10 min-h-0">
        {/* Sidebar */}
        <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${activeChat ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-white/5 flex-shrink-0">
            <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input type="text" placeholder="Search..." className="w-full bg-gray-800/50 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {conversations.map((chat) => (
              <button key={chat.email} onClick={() => handleChatSelect(chat)} className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${activeChat?.email === chat.email ? "bg-indigo-600/20 border-indigo-500/30" : "hover:bg-white/5 border-transparent border"}`}>
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=random`} className="w-12 h-12 rounded-full ring-2 ring-white/10" alt="" />
                <div className="flex-1 text-left min-w-0">
                  <h3 className="font-semibold truncate text-white">{chat.name}</h3>
                  <p className="text-sm truncate text-gray-400">{chat.lastMessage}</p>
                </div>
                <div className="text-[10px] text-gray-500">{formatTime(chat.lastMessageTime)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col min-w-0 bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${!activeChat ? "hidden md:flex" : "flex"}`}>
          {activeChat ? (
            <>
              <div className="flex-shrink-0 p-4 border-b border-white/5 flex items-center gap-4 bg-white/5">
                <button onClick={() => setActiveChat(null)} className="md:hidden text-gray-400"><ChevronLeft size={24} /></button>
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.name)}&background=random`} className="w-10 h-10 rounded-full ring-2 ring-indigo-500/30" alt="" />
                <h3 className="font-semibold text-white">{activeChat.name}</h3>
              </div>

              {/* MESSAGE SECTION SCROLL FIX */}
              <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-6 custom-scrollbar bg-black/20">
                {messages.map((msg, index) => {
                  const isMe = msg.senderEmail === user.email;
                  return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg._id || index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2 shadow-md ${isMe ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-sm" : "bg-gray-800 text-gray-200 rounded-tl-sm border border-white/5"}`}>
                        <p className="leading-relaxed break-words text-sm">{msg.content}</p>
                        <p className={`text-[9px] mt-1 text-right ${isMe ? "text-indigo-200" : "text-gray-500"}`}>{formatTime(msg.createdAt)}</p>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} className="h-2" />
              </div>

              <div className="flex-shrink-0 p-4 border-t border-white/5 bg-gray-900/80">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto">
                  <div className="flex-1 bg-gray-800/40 border border-white/10 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500/40 transition-all">
                    <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type a message..." className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 text-sm outline-none" />
                  </div>
                  <button type="submit" disabled={!messageInput.trim()} className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-50 active:scale-95 flex-shrink-0">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Send size={36} className="mb-4 opacity-20" />
                <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChatPage;