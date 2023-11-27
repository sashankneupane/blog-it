import express from "express";

import homeRouter from "./home.mjs";
import authRouter from "./auth.mjs";
import userRouter from "./user.mjs";
import blogRouter from "./blog.mjs";

const appRouter = express.Router();

// Higher Order Function to create routes
export function createRoute(router, path, ...middlewares) {
  const addRoute = (method, handler) => {
    router[method](path, ...middlewares, handler);
    return createRoute(router, path, ...middlewares);
  };
  return {
    get: (handler) => addRoute("get", handler),
    post: (handler) => addRoute("post", handler),
  };
}

appRouter.use("/", homeRouter);
appRouter.use("/auth", authRouter);
appRouter.use("/u", userRouter);
appRouter.use("/blog", blogRouter);

export default appRouter;
