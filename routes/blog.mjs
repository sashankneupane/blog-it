import express from "express";
import {
  getWriteBlogPage,
  writeBlogPost,
  getBlogPageById,
  getRandomBlogPost,
  getBlogEditPageById,
  editBlogPostById,
  deleteBlogPostById,
  ensureOwnership,
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
router.get("/:blogId/delete", ensureOwnership, deleteBlogPostById);

export default router;
