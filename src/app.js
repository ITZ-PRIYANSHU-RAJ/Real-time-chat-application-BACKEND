import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.use("/uploads", express.static(path.resolve("server/uploads")));

  app.get("/api/health", (_, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/chats", chatRoutes);
  app.use("/api/messages", messageRoutes);

  app.use((error, _, res, __) => {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  });

  return app;
};
