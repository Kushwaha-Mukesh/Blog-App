import express from "express";
import {
  createComment,
  getComment,
  likeComment,
} from "../controllers/comment.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = express.Router();

router.post("/create", isLoggedIn, createComment);
router.get("/getComment/:postId", getComment);
router.get("/likeComment/:id", isLoggedIn, likeComment);

export default router;
