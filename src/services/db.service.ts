import mongoose from "mongoose";
import type { Connection } from "mongoose";

export async function connectDB(): Promise<Connection> {
  try {
    await mongoose.connect("mongodb+srv://shahbazkhalid818_db_user:uvbjl33f6uqRFNOt@cluster0.w2ofhca.mongodb.net/");

    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
