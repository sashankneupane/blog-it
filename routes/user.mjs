import express from "express";
import {
  getPublicUserBlogsPage,
  getDashboardPage,
  updateUser,
} from "../controllers/userController.mjs";
import { ensureAuthentication } from "../middlewares/auth.mjs";

const userRouter = express.Router();

userRouter.get("/dashboard", getDashboardPage);

userRouter.post("/update-profile", ensureAuthentication, updateUser);

userRouter.get("/:username", getPublicUserBlogsPage);

export default userRouter;
