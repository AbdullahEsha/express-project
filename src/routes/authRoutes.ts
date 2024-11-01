import { Router } from "express";
import { register, login, refreshToken } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
