import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/post.js";

const router = express.Router();

router.post("/create", isLoggedIn, createPost);
router.get("/getposts", getPosts);
router.put("/updatepost/:postId", isLoggedIn, updatePost);
router.delete("/deletepost/:postId", isLoggedIn, deletePost);

export default router;
