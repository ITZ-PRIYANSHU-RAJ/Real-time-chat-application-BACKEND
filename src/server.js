import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { connectDb } from "./config/db.js";
import { createApp } from "./app.js";
import { configureSocket } from "./socket.js";

const port = process.env.PORT || 5000;
const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
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
