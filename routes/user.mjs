import express from "express";
import {
  getPublicUserBlogsPage,
  getDashboardPage,
  updateUser,
} from "../controllers/userController.mjs";
import { ensureAuthentication } from "../middlewares/auth.mjs";

const router = express.Router();

router.get("/dashboard", ensureAuthentication, getDashboardPage);
router.post("/update-profile", ensureAuthentication, updateUser);
router.get("/:username", getPublicUserBlogsPage);

export default router;
