import express from "express";

import "./config.mjs";
import "./db/index.mjs";

const app = express();

import { setPassportStrategies } from "./middlewares/auth.mjs";
setPassportStrategies(app);

import setCommonMiddlewares from "./middlewares/commonMiddlewares.mjs";
setCommonMiddlewares(app);

import router from "./routes/index.mjs";
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
