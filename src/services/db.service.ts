import mongoose from "mongoose";
import type { Connection } from "mongoose";

export async function connectDB(): Promise<Connection> {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);

    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
