import bcryptjs from "bcryptjs";

import User from "../db/models/User.mjs";
import BlogPost from "../db/models/Blogpost.mjs";

async function getUserByUsername(username) {
  return await User.findOne({ username: username });
}

export async function getPublicUserBlogsPage(req, res) {
  const user = await getUserByUsername(req.params.username);
  let blogPosts;
  try {
    blogPosts = await BlogPost.find({ author: user._id })
      .populate("author")
      .populate("tags");
  } catch (error) {
    console.error(error);
  }

  res.render("blog-list", {
    username: user.username,
    blogPosts: blogPosts,
    user: req.user,
  });
}

export async function getDashboardPage(req, res) {
  if (req.isAuthenticated()) {
    const user = req.user;
    const blogPosts = await BlogPost.find({ author: user._id });
    res.render("dashboard", {
      username: user.username,
      userBlogs: blogPosts,
      user: req.user,
    });
  } else {
    res.redirect("/auth/login");
  }
}

export async function updateUser(req, res) {
  try {
    const user = await User.findById(req.user._id);

    const isPasswordCorrect = await bcryptjs.compare(
      req.body.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
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
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(200).json({ message: "Updated successfully" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
