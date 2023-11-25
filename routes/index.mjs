import express from "express";

import homeRoutes from "./home.mjs";
import authRoutes from "./auth.mjs";
import apiRoutes from "./api.mjs";
import userRoutes from "./user.mjs";
import blogRoutes from "./blog.mjs";

const router = express.Router();

router.use("/", homeRoutes);
router.use("/auth", authRoutes);
router.use("/u", userRoutes);
router.use("/blog", blogRoutes);
router.use("/api", apiRoutes);

export default router;
