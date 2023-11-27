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

import bcryptjs from "bcryptjs";
import User from "../db/models/User.mjs";

router.get("/update", async (req, res) => {
  if (!req.isAuthenticated() || req.user.username !== "admin") {
    res.redirect("/");
  }
  const users = await User.find({});
  for (const user of users) {
    const hashedPassword = await bcryptjs.hash(user.password, 10);
    user.password = hashedPassword;
    await user.save();
  }
  res.send("done");
});

// REGISTER Page
router.get("/register", getRegisterPage);
router.post("/register", registerUser);

// LOGIN Page
router.get("/login", getLoginPage);
router.post("/login", loginUser);

// USER INFO Page
router.get("/user", ensureAuthentication, getUserInfo);

// LOGOUT Page
router.get("/logout", logout);

export default router;
