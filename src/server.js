import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { connectDb } from "./config/db.js";
import { createApp } from "./app.js";
import { configureSocket } from "./socket.js";

const port = process.env.PORT || 5000;
const requiredEnv = ["MONGODB_URI", "JWT_SECRET"];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const app = createApp();
const server = http.createServer(app);
const socketOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const io = new Server(server, {
  cors: {
    origin: socketOrigins.length ? socketOrigins : true,
    credentials: true,
  },
});

configureSocket(io);

const start = async () => {
  try {
    await connectDb();
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();
