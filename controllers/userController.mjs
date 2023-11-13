import User from "../db/models/User.mjs";
import BlogPost from "../db/models/Blogpost.mjs";

async function getUserByUsername(username) {
  return await User.findOne({ username: username });
}

export async function getPublicUserBlogsPage(req, res) {
  const user = await getUserByUsername(req.params.username);
  const blogPosts = await BlogPost.find({ author: user._id });
  res.render("public-user-blogs", {
    username: user.username,
    blogPosts: blogPosts,
    user: req.user,
  });
}

export async function getDashboardPage(req, res) {
  if (req.isAuthenticated()) {
    const user = req.user;
    const blogPosts = await BlogPost.find({ author: user._id });
    res.render("dashboard-layout", {
      username: user.username,
      userBlogs: blogPosts,
      user: req.user,
    });
  } else {
    res.redirect("/auth/login");
  }
}
