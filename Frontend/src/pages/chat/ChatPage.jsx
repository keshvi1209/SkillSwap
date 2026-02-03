import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Send,
    ChevronLeft
} from "lucide-react";
import Header from "../../components/layout/Header";
import { useAuth } from "../../context/AuthContext";
import { getSocket } from "../../components/socket/socketService";
import api from "../../services/api";

const ChatPage = () => {
    const { user } = useAuth();
    const [activeChat, setActiveChat] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [showSidebar, setShowSidebar] = useState(true);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        const socket = getSocket();

        const handleReceiveMessage = (data) => {
            // Update messages if looking at this chat
            if (activeChat && data.fromEmail === activeChat.email) {
                setMessages((prev) => [...prev, {
                    senderEmail: data.fromEmail,
                    receiverEmail: user.email,
                    content: data.message,
                    createdAt: new Date().toISOString(),
                    senderName: data.fromName
                }]);
            }
            // Update conversation list always
            updateConversationOnNewMessage(data.fromEmail, data.message, data.fromName);
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [activeChat, user?.email]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const updateConversationOnNewMessage = (email, text, name) => {
        setConversations(prev => {
            const existingIndex = prev.findIndex(c => c.email === email);
            let updatedConversations = [...prev];

            if (existingIndex > -1) {
                const updatedChat = {
                    ...updatedConversations[existingIndex],
                    lastMessage: text,
                    lastMessageTime: new Date().toISOString()
                };
                // Move to top
                updatedConversations.splice(existingIndex, 1);
                updatedConversations.unshift(updatedChat);
            } else {
                // New conversation partner
                updatedConversations.unshift({
                    email: email,
                    name: name,
                    lastMessage: text,
                    lastMessageTime: new Date().toISOString()
                });
            }
            return updatedConversations;
        });
    }

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

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeChat) return;

        const socket = getSocket();
        const msgData = {
            fromName: user.name,
            fromEmail: user.email,
            toEmail: activeChat.email,
            message: messageInput
        };

        socket.emit("send_message", msgData);

        // Optimistic update
        const newMessage = {
            senderEmail: user.email,
            receiverEmail: activeChat.email,
            content: messageInput,
            createdAt: new Date().toISOString(),
            senderName: user.name
        };

        setMessages([...messages, newMessage]);

        // Update local list
        setConversations(prev => {
            const existingIndex = prev.findIndex(c => c.email === activeChat.email);
            let updatedConversations = [...prev];
            if (existingIndex > -1) {
                updatedConversations[existingIndex] = {
                    ...updatedConversations[existingIndex],
                    lastMessage: messageInput,
                    lastMessageTime: new Date().toISOString()
                };
                const item = updatedConversations.splice(existingIndex, 1)[0];
                updatedConversations.unshift(item);
            }
            return updatedConversations;
        });

        setMessageInput("");
    };

    // Helper for formatting time
    const formatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col font-sans text-gray-200">

            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <Header />

            <main className="flex-1 flex max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 h-[calc(100vh-80px)] gap-6 relative z-10">

                {/* Sidebar - Contact List */}
                <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${activeChat ? 'hidden md:flex' : 'flex'}`}>

                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 px-2">Messages</h2>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 w-4 h-4 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full bg-gray-800/50 border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-gray-800 transition-all placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Contact List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {conversations.length === 0 && (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No conversations yet.
                            </div>
                        )}
                        {conversations.map((chat) => (
                            <button
                                key={chat.email}
                                onClick={() => handleChatSelect(chat)}
                                className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group ${activeChat?.email === chat.email
                                    ? "bg-indigo-600/20 border border-indigo-500/30"
                                    : "hover:bg-white/5 border border-transparent"
                                    }`}
                            >
                                <div className="relative">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=random`}
                                        alt={chat.name}
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-indigo-500/50 transition-all"
                                    />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <h3 className={`font-semibold truncate mb-0.5 ${activeChat?.email === chat.email ? 'text-white' : 'text-gray-200'}`}>
                                        {chat.name}
                                    </h3>
                                    <p className={`text-sm truncate ${activeChat?.email === chat.email ? 'text-indigo-200' : 'text-gray-400'}`}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {formatTime(chat.lastMessageTime)}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`flex-1 flex flex-col bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setActiveChat(null)}
                                        className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <div className="relative">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.name)}&background=random`}
                                            alt={activeChat.name}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{activeChat.name}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-black/20">
                                {messages.map((msg, index) => {
                                    const isMe = msg.senderEmail === user.email;
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={msg._id || index}
                                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`max-w-[75%] sm:max-w-[60%] rounded-2xl px-5 py-3 shadow-md ${isMe
                                                ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-sm"
                                                : "bg-gray-800 text-gray-200 rounded-tl-sm border border-white/5"
                                                }`}>
                                                <p className="leading-relaxed">{msg.content}</p>
                                                <p className={`text-[10px] mt-1 text-right ${isMe ? "text-indigo-200" : "text-gray-500"
                                                    }`}>
                                                    {formatTime(msg.createdAt)}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t border-white/5 bg-gray-900/80">
                                <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
                                    <div className="flex-1 bg-gray-800/50 border border-white/10 rounded-2xl p-2 flex items-center gap-2 focus-within:ring-1 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all">
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder="Type your message..."
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 px-2 py-1"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim()}
                                        className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex-shrink-0"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
                            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full animate-pulse opacity-50 absolute" />
                                <Send size={40} className="relative z-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Select a Conversation</h3>
                            <p className="max-w-xs">Choose a contact from the left list to start chatting or connect with someone new.</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default ChatPage;
