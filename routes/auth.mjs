import express from "express";
import {
  getRegisterPage,
  getLoginPage,
  registerUser,
  loginUser,
  logout,
} from "../controllers/authController.mjs";

const router = express.Router();

// REGISTER Page
router.get("/register", getRegisterPage);
router.post("/register", registerUser);

// LOGIN Page
router.get("/login", getLoginPage);
router.post("/login", loginUser);

// LOGOUT Page
router.get("/logout", logout);

export default router;
