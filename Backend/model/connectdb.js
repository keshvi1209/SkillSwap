import mongoose from "mongoose";

const connectdb = async () => {
  try {
    await mongoose.connect("mongodb+srv://keshviagarwal2004:Keshvi2004%40@practice.dlmtecr.mongodb.net/SillSwap");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectdb;