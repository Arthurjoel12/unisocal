import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import chatRoutes from "./routes/chat.js";
import connectRoutes from "./routes/friends.js";
import messageRoutes from "./routes/message.js";
import mongoose from "mongoose";
mongoose.set("strictQuery", true);
import bodyParser from "body-parser";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/connect", connectRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => {
    console.log(`${error} didn't connect`);
  });
