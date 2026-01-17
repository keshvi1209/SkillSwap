
const emailToSocketMap = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", ({ email }) => {
      emailToSocketMap.set(email, socket.id);
      console.log("Users:", emailToSocketMap);
      console.log(`User joined -> Email: ${email}, SocketID: ${socket.id}`);
    });

    socket.on("send_message", ({ toEmail, message }) => {
      const receiverSocketId = emailToSocketMap.get(toEmail);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", { message });
      }
    });

    socket.on("disconnect", () => {
      for (const [email, socketId] of emailToSocketMap.entries()) {
        if (socketId === socket.id) {
          emailToSocketMap.delete(email);
          break;
        }
      }
      console.log("Disconnected:", socket.id);
    });
  });
};

export default socketHandler;
