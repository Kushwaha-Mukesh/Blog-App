import express from "express";
import { authenticate, google, signIn, signUp } from "../controllers/auth.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/google", google);
router.get("/isAuthenticated", isLoggedIn, authenticate);

export default router;
