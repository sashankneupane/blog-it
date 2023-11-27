import express from "express";

import "./config.mjs";
import "./db/index.mjs";

import setCommonMiddlewares from "./middlewares/commonMiddlewares.mjs";

import Auth from "./middlewares/auth.mjs";
import appRouter from "./routes/index.mjs";


class App {
  constructor() {
    this.app = express();
    this.setup();
  }

  setup() {
    new Auth(this.app);
    setCommonMiddlewares(this.app);
    this.app.use("/", appRouter);
  }

  start() {
    const PORT = process.env.PORT || 3000;
    this.app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}

export default App;
