import Message from "../model/chat/Message.js";

const emailToSocketMap = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", ({ email }) => {
      emailToSocketMap.set(email, socket.id);
      console.log(`User joined -> Email: ${email}, SocketID: ${socket.id}`);
    });

    // Added 'async' here so you can use 'await' for the DB call
    socket.on("send_message", async ({ fromName, fromEmail, toEmail, message }) => {
      const receiverSocketId = emailToSocketMap.get(toEmail);

      try {
        // 1. Save to Database
        const newMessage = await Message.create({
          senderEmail: fromEmail,
          receiverEmail: toEmail,
          senderName: fromName,
          content: message,
          // Note: If your schema uses timestamps: true, you don't strictly need 'timestamp' field
        });

        // 2. Emit to receiver if online
        if (receiverSocketId) {
          // Sending back the whole object (including fromEmail) helps the frontend route correctly
          io.to(receiverSocketId).emit("receive_message", { 
            fromName, 
            fromEmail, 
            message 
          });
        }
      } catch (error) {
        console.error("Error saving message:", error);
      }
    }); // End of send_message

    socket.on("disconnect", () => {
      for (const [email, socketId] of emailToSocketMap.entries()) {
        if (socketId === socket.id) {
          emailToSocketMap.delete(email);
          break;
        }
      }
      console.log("Disconnected:", socket.id);
    });
  }); // End of connection
};

export default socketHandler;