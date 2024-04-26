import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { createPost } from "../controllers/post.js";

const router = express.Router();

router.post("/create", isLoggedIn, createPost);

export default router;
