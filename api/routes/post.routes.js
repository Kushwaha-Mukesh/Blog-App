import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { createPost, getPosts } from "../controllers/post.js";

const router = express.Router();

router.post("/create", isLoggedIn, createPost);
router.get("/getposts", getPosts);

export default router;
