import io from "socket.io-client";
import { toast } from "react-toastify";
// 1. Define your Backend URL (Use env variable)
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

let socket;

export const connectSocket = (email) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.emit("join", { email });
    // toast.success("Hey! You are connected 🚀", {
    //   position: "bottom-right",
    //   autoClose: 3000,
    // });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return connectSocket(); // Auto-connect if accessed before initialization
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
