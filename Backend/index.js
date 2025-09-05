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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
