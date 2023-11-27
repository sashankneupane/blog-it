import express from "express";
import {
  getRegisterPage,
  getLoginPage,
  registerUser,
  loginUser,
  logout,
} from "../controllers/authController.mjs";
import { ensureAuthentication } from "../middlewares/auth.mjs";
import { createRoute } from "./index.mjs";

const authRouter = express.Router();

// ------------------ SUPER PRIVELEGED ROUTE ------------------
// This route is only for the admin to update the password of all users
// Hashes the password of all dummy users in the db created by Faker
import bcryptjs from "bcryptjs";
import User from "../db/models/User.mjs";

authRouter.get("/update", async (req, res) => {
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
// -----------------------------------------------------------

// REGISTER Page
createRoute(authRouter, "/register").get(getRegisterPage).post(registerUser);

// LOGIN Page
createRoute(authRouter, "/login").get(getLoginPage).post(loginUser);

// LOGOUT Page
authRouter.get("/logout", ensureAuthentication, logout);

export default authRouter;
