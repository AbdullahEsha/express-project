import { Router } from "express";
import {
  resetPassword,
  resetPasswordUpdate,
} from "../controllers/emailVerifyController";

const router = Router();

router.post("/reset-password", resetPassword);
router.post("/reset-password/:token", resetPasswordUpdate);

export default router;
