import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

let socket;

export const connectSocket = (email) => {
  // If socket exists but we have a new email (e.g., user switched accounts), 
  // we should re-emit join or reconnect.
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket Connected:", socket.id);
      // It's safer to emit join inside the 'connect' listener 
      // to handle auto-reconnects properly
      if (email) socket.emit("join", { email });
    });
  } else if (email) {
    // If socket already exists, just make sure we are 'joined' with the right email
    socket.emit("join", { email });
  }

  return socket;
};

export const getSocket = () => {
  // Instead of auto-connecting without an email, return null or 
  // pull the email from localStorage inside this function
  if (!socket) {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) return connectSocket(savedEmail);
    console.warn("⚠️ getSocket called but no socket or saved email found.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("❌ Socket Disconnected");
  }
};