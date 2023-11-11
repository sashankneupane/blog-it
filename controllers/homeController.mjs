import BlogPost from "../db/models/Blogpost.mjs";

async function getBlogPosts(query) {
  let blogPosts;
  if (query.search) {
    const regexPattern = new RegExp(query.search, "i");
    blogPosts = await BlogPost.find({
      $or: [{ title: regexPattern }, { content: regexPattern }],
    });
  } else {
    // If there is no search query, return all blog posts
    blogPosts = await BlogPost.find({});
  }
  return blogPosts;
}
export async function getHomePage(req, res) {
  const data = {};
  data.blogPosts = await getBlogPosts(req.query || {});
  res.render("home", {
    data: data,
    user: req.user,
  });
}

export async function redirectToHomePage(req, res) {
  res.redirect("/home");
}
