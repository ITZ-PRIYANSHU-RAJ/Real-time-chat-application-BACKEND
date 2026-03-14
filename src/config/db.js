import mongoose from "mongoose";

export const connectDb = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Set it in your Render environment.");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  });
  console.log("MongoDB connected");
};
