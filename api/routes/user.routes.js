import express from "express";
import { updateUser } from "../controllers/user.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = express.Router();

router.put("/update/:userId", isLoggedIn, updateUser);

export default router;
