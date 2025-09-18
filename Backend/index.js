import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./model/connectdb.js";
import routes from "./route/route.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectdb();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "https://skill-swap-jet-one.vercel.app", // your deployed frontend
  "http://localhost:5000",                 // local Vite frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies & authorization headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
