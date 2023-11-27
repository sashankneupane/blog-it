import bcryptjs from "bcryptjs";

import User from "../db/models/User.mjs";
import BlogPost from "../db/models/Blogpost.mjs";

import { chainMiddlewares } from "../middlewares/commonMiddlewares.mjs";
import { ensureAuthentication } from "../middlewares/auth.mjs";

async function getUserByUsername(username) {
  return await User.findOne({ username: username });
}

export async function getPublicUserBlogsPage(req, res) {
  const user = await getUserByUsername(req.params.username);
  if (!user) {
    return res.redirect("/");
  }

  const blogPosts = await BlogPost.find({ author: user._id })
    .populate("author")
    .populate("tags");

  return res.render("blog-list", {
    username: user.username,
    blogPosts: blogPosts,
    user: req.user,
  });
}

export const getDashboardPage = chainMiddlewares(
  ensureAuthentication,
  async (req, res) => {
    const user = req.user;
    const blogPosts = await BlogPost.find({ author: user._id });
    res.render("dashboard", {
      username: user.username,
      userBlogs: blogPosts,
      user: req.user,
    });
  },
)

export async function updateUser(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.body.password || !user.password) {
      return res.status(400).json({ message: "Invalid request" });
    }

    try {
      const isPasswordCorrect = await bcryptjs.compare(
        req.body.password,
        user.password,
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Incorrect password" });
      }
    } catch (bcryptError) {
      console.error(bcryptError);
      return res.status(500).json({ message: "Error comparing passwords" });
    }

    // Update user information
    user.name = req.body.name;
    user.username = req.body.username;
    user.email = req.body.email;

    await user.save();

    // User stays logged in
    req.login(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      } else {
        return res.status(200).json({ message: "Updated successfully" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
