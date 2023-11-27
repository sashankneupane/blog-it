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

const router = express.Router();

// Random blog post
router.get("/random", getRandomBlogPost);

// Page to write a new blog post
router.get("/write", ensureAuthentication, getWriteBlogPage);
router.post("/write", ensureAuthentication, writeBlogPost);

// Page to view a single blog post
router.get("/:blogId", getBlogPageById);

// Page to edit a blog post
router.get("/:blogId/edit", ensureOwnership, getBlogEditPageById);
router.post("/:blogId/edit", ensureOwnership, editBlogPostById);

// DELETE a blog post
router.post("/:blogId/delete", ensureOwnership, deleteBlogPostById);

// like a blog post
router.post("/:blogId/like", ensureAuthentication, likeBlogPost);

// comment a blog post
router.post(
  "/:blogId/comment/write",
  ensureAuthentication,
  commentBlogPost,
);

// update comment on a blog post
router.post(
  "/:blogId/comment/:commentId/edit",
  ensureAuthentication,
  editCommentById,
);

// delete a comment
router.post(
  "/:blogId/comment/:commentId/delete",
  ensureAuthentication,
  deleteCommentById,
);

export default router;
