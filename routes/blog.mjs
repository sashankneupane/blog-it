import express from "express";
import {
  getWriteBlogPage,
  writeBlogPost,
  getBlogPageById,
  getRandomBlogPost,
  getBlogEditPageById,
  editBlogPostById,
  deleteBlogPostById,
  likeBlogPost,
  ensureOwnership,
  commentBlogPost,
  editCommentById,
  deleteCommentById,
} from "../controllers/blogController.mjs";
import { ensureAuthentication } from "../middlewares/auth.mjs";
import { createRoute } from "./index.mjs";

const blogRouter = express.Router();

// Random blog post
blogRouter.get("/random", getRandomBlogPost);

// Page to write a new blog post
createRoute(blogRouter, "/write", ensureAuthentication)
  .get(getWriteBlogPage)
  .post(writeBlogPost);

// Page to view a single blog post
blogRouter.get("/:blogId", getBlogPageById);

// Page to edit a blog post
createRoute(blogRouter, "/:blogId/edit", ensureAuthentication)
  .get(getBlogEditPageById)
  .post(editBlogPostById);

// DELETE a blog post
blogRouter.post("/:blogId/delete", ensureOwnership, deleteBlogPostById);

// like a blog post
blogRouter.post("/:blogId/like", ensureAuthentication, likeBlogPost);

// comment a blog post
blogRouter.post(
  "/:blogId/comment/write",
  ensureAuthentication,
  commentBlogPost,
);

// update comment on a blog post
blogRouter.post(
  "/:blogId/comment/:commentId/edit",
  ensureAuthentication,
  editCommentById,
);

// delete a comment
blogRouter.post(
  "/:blogId/comment/:commentId/delete",
  ensureAuthentication,
  deleteCommentById,
);

export default blogRouter;
