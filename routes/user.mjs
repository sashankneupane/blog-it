import express from "express";
import {
  getPublicUserBlogsPage,
  getDashboardPage,
} from "../controllers/userController.mjs";
import { ensureAuthentication } from "../middlewares/auth.mjs";

const router = express.Router();

router.get("/dashboard", ensureAuthentication, getDashboardPage);
router.get(":/username", ensureAuthentication, getPublicUserBlogsPage);

export default router;
