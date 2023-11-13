import express from "express";

import "./config.mjs";
import "./db/index.mjs";

import setCommonMiddlewares from "./middlewares/commonMiddlewares.mjs";
import { setPassportStrategies } from "./middlewares/auth.mjs";
import router from "./routes/index.mjs";

const app = express();
setCommonMiddlewares(app);
setPassportStrategies(app);

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
