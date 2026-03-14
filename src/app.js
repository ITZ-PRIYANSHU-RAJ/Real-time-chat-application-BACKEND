import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const parseAllowedOrigins = () =>
  (process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const createApp = () => {
  const app = express();
  const allowedOrigins = parseAllowedOrigins();

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.length === 0) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
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
