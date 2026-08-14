import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

export default connectDB;