import express from "express";
import cors from "cors";
import connectdb from "./model/connectdb.js";
import userRoutes from "./route/route.js";

connectdb();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", userRoutes);
const PORT = 5000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

