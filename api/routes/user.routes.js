import express from "express";
import { deleteUser, updateUser } from "../controllers/user.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = express.Router();

router.put("/update/:userId", isLoggedIn, updateUser);
router.delete("/delete/:userId", isLoggedIn, deleteUser);

export default router;
