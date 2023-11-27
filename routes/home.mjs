import express from "express";
import {
  getHomePage,
  redirectToHomePage,
} from "../controllers/homeController.mjs";

const homeRouter = express.Router();

homeRouter.get("/", redirectToHomePage);
homeRouter.get("/home", getHomePage);

export default homeRouter;
