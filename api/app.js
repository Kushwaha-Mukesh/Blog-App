import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import path from "path";
dotenv.config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log("Error connecting to Database: ", err);
  });

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);

app.use(express.static(path.join(__dirname, "blog-frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "blog-frontend", "dist", "index.html"));
});

export default app;
