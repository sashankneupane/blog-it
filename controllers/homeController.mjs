import BlogPost from "../db/models/Blogpost.mjs";

async function getBlogPosts(query) {
  const blogPosts = await BlogPost.find(query)
    .populate("author")
    .populate("tags");
  return blogPosts;
}

export async function getHomePage(req, res) {
  const data = {};
  data.blogPosts = await getBlogPosts({});
  console.log(data.blogPosts[0]);
  res.render("home", {
    data: data,
    user: req.user,
  });
}

export async function redirectToHomePage(req, res) {
  res.redirect("/home");
}
