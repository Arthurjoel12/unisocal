import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Set Mongoose strictQuery option
mongoose.set("strictQuery", false);

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Routes
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import chatRoutes from "./routes/chat.js";
import connectRoutes from "./routes/friends.js";
import messageRoutes from "./routes/message.js";

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/connect", connectRoutes);
app.use("/api/message", messageRoutes);

// Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle Socket.io events and functionality here

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });