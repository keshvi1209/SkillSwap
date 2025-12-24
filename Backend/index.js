import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import connectdb from "./model/connectdb.js";
import routes from "./route/route.js";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./route/auth.js";
import meetRoutes from "./route/meet.js";

// --- 1. NEW IMPORTS FOR SOCKET.IO ---
import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./model/Message.js"; // Ensure you created this file!

dotenv.config();
connectdb();

const app = express();

// --- 2. WRAP EXPRESS APP IN HTTP SERVER ---
const httpServer = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "https://skill-swap-jet-one.vercel.app", 
  "http://localhost:5173", 
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// --- 3. SOCKET.IO SETUP ---
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins, // Reuse your allowed origins
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // set to true in production with HTTPS
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRoutes);
app.use("/", routes);
app.use("/meet", meetRoutes);

// --- 4. NEW: CHAT HISTORY ROUTE ---
app.get("/chats/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    // Fetch messages for this room, sorted by time (oldest first)
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// --- 5. NEW: SOCKET.IO LOGIC ---
io.on("connection", (socket) => {
  console.log(`Socket Connected: ${socket.id}`);

  // Join a specific Request ID room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Handle sending messages
  socket.on("send_message", async (data) => {
    // data = { room, authorId, authorName, message, time }
    
    // 1. Broadcast to everyone else in the room
    socket.to(data.room).emit("receive_message", data);

    // 2. Save to Database
    try {
      const newMessage = new Message({
        roomId: data.room,
        authorId: data.authorId,
        authorName: data.authorName,
        message: data.message,
        time: data.time,
      });
      await newMessage.save();
    } catch (err) {
      console.error("Error saving message to DB:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket Disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// --- 6. IMPORTANT: CHANGE 'app.listen' TO 'httpServer.listen' ---
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});