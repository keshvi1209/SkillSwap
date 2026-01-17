import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import connectdb from "./config/connectdb.js";
import routes from "./route/route.js";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./route/auth.js";
import meetRoutes from "./route/meet.js";
import socketHandler from "./socket/socket.js";


import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./model/chat/Message.js"; 
dotenv.config();
connectdb();

const app = express();

// --- 2. CREATE HTTP SERVER ---
const httpServer = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Centralized Allowed Origins
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
    origin: allowedOrigins,
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
      secure: process.env.NODE_ENV === "production", // True in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRoutes);
app.use("/", routes);
app.use("/meet", meetRoutes);

// --- 4. CHAT HISTORY ROUTE ---
app.get("/chats/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    // Fetch messages sorted by creation time (Oldest -> Newest)
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// --- 5. SOCKET.IO LOGIC ---
socketHandler(io);
const PORT = process.env.PORT || 5000;

// --- 6. LISTEN WITH HTTPSERVER ---
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});