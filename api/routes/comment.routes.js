import express from "express";
import { createComment, getComment } from "../controllers/comment.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = express.Router();

router.post("/create", isLoggedIn, createComment);
router.get("/getComment/:postId", getComment);

export default router;
