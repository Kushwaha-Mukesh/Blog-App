import express from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getAllComments,
  getComment,
  likeComment,
} from "../controllers/comment.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = express.Router();

router.post("/create", isLoggedIn, createComment);
router.get("/getComment/:postId", getComment);
router.get("/getComments/", isLoggedIn, getAllComments);
router.get("/likeComment/:id", isLoggedIn, likeComment);
router.put("/editComment/:id", isLoggedIn, editComment);
router.delete("/deleteComment/:id", isLoggedIn, deleteComment);

export default router;
