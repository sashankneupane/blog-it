import express from "express";
import {
  getRegisterPage,
  getLoginPage,
  getUserInfo,
  registerUser,
  loginUser,
  logout,
} from "../controllers/authController.mjs";

import { ensureAuthentication } from "../middlewares/auth.mjs";

const router = express.Router();

// REGISTER Page
router.get("/register", getRegisterPage);
router.post("/register", registerUser);

// LOGIN Page
router.get("/login", getLoginPage);
router.post("/login", loginUser);

// USER INFO Page
router.get('/user', ensureAuthentication, getUserInfo);

// LOGOUT Page
router.get("/logout", logout);

export default router;