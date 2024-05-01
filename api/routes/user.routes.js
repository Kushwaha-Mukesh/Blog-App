import express from "express";
import {
  deleteUser,
  getUsers,
  signOut,
  updateUser,
} from "../controllers/user.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = express.Router();

router.get("/getusers", isLoggedIn, getUsers);
router.put("/update/:userId", isLoggedIn, updateUser);
router.delete("/delete/:userId", isLoggedIn, deleteUser);
router.get("/signOut", signOut);

export default router;
