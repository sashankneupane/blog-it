import express from "express";

import { ensureAuthentication } from "../middlewares/auth.mjs";

import { getLikes } from "../controllers/interactionController.mjs";

const router = express.Router();

router.get("/likes/:blogId", ensureAuthentication, getLikes);

export default router;
