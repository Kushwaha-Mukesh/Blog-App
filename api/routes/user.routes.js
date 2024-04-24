import express from "express";
import { deleteUser, signOut, updateUser } from "../controllers/user.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = express.Router();

router.put("/update/:userId", isLoggedIn, updateUser);
router.delete("/delete/:userId", isLoggedIn, deleteUser);
router.get("/signOut", signOut);

export default router;
