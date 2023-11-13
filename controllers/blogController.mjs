import User from "../db/models/User.mjs";
import BlogPost from "../db/models/Blogpost.mjs";
import Tag from "../db/models/Tag.mjs";

async function getBlogPostById(id) {
  return await BlogPost.findById(id);
}

async function getUserByID(id) {
  return await User.findById(id);
}

export async function ensureOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    const blogPost = await getBlogPostById(req.params.blogId);
    if (blogPost && req.user._id.toString() === blogPost.author.toString()) {
      return next();
    }
  }
  if (req.isAuthenticated()) {
    res.redirect("/u/dashboard");
  } else {
    res.redirect("/auth/login");
  }
}

export async function getWriteBlogPage(req, res) {
  res.render("write", {
    user: req.user,
  });
}

export async function writeBlogPost(req, res) {
  const user = await getUserByID(req.user._id);
  const blogPost = new BlogPost({
    title: req.body.title,
    content: req.body.content,
    author: user._id,
    publicationDate: Date.now(),
    lastUpdated: Date.now(),
    comments: [],
    likes: [],
  });
  await blogPost.save();
  res.redirect(`/blog/${blogPost._id}`);
}

export async function getBlogPageById(req, res) {
  let blogPost;
  try {
    blogPost = await getBlogPostById(req.params.blogId);
    blogPost.author = await getUserByID(blogPost.author);
    blogPost.comments = await Promise.all(
      blogPost.comments.map(async (comment) => {
        comment.author = await getUserByID(comment.author);
        return comment;
      }),
    );
    blogPost.likes = await Promise.all(
      blogPost.likes.map(async (like) => {
        like.author = await getUserByID(like.author);
        return like;
      }),
    );
    blogPost.author.blogPosts = await BlogPost.find({
      author: blogPost.author._id,
    });
  } catch (error) {
    console.error("Error getting blog post:", error);
    res.status(500).send("Internal Server Error");
  }
  res.render("blog-post", {
    blogPost: blogPost,
    user: req.user,
  });
}

export async function getRandomBlogPost(req, res) {
  try {
    const randomBlogPost = await BlogPost.aggregate([
      { $sample: { size: 1 } },
      { $project: { _id: 1 } },
    ]);
    res.redirect(`/blog/${randomBlogPost[0]._id}`);
  } catch (error) {
    console.error("Error getting random blog post:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getBlogEditPageById(req, res) {
  const blogPost = await getBlogPostById(req.params.blogId);
  res.render("blog-edit", {
    blogPost: blogPost,
    user: req.user,
  });
}

export async function editBlogPostById(req, res) {
  const updatedFields = {
    title: req.body.title,
    content: req.body.content,
    lastUpdated: Date.now(),
    tags: req.body.tags.split(","),
  };
  updatedFields.tags = updatedFields.tags.map((tag) => {
    tag = tag.trim();
    try {
      const tagObj = Tag.findOne({ name: tag });
      return tagObj._id;
    } catch (error) {
      const newTag = new Tag({ name: tag });
      newTag.save();
      return newTag._id;
    }
  });
  try {
    const result = await BlogPost.findByIdAndUpdate(
      req.params.blogId,
      { $set: updatedFields },
      { new: true },
    );

    if (result) {
      res.redirect(`/blog/${req.params.blogId}`);
    } else {
      res.status(404).send("Blog post not found.");
    }
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function deleteBlogPostById(req, res) {
  try {
    const result = await BlogPost.findByIdAndDelete(req.params.blogId);
    if (result) {
      res.redirect("/u/dashboard");
    } else {
      res.status(404).send("Blog post not found.");
    }
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).send("Internal Server Error");
  }
}
