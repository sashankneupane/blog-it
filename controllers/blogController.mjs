import User from "../db/models/User.mjs";
import BlogPost from "../db/models/Blogpost.mjs";
import Tag from "../db/models/Tag.mjs";
import Comment from "../db/models/Comment.mjs";
import Like from "../db/models/Like.mjs";

import { ensureAuthentication } from "../middlewares/auth.mjs";
import { chainMiddlewares } from "../middlewares/commonMiddlewares.mjs";

async function getNumberOfLikes(blogPostId) {
  try {
    return await Like.countDocuments({ blogPost: blogPostId });
  } catch (error) {
    console.error("Error getting number of likes:", error);
  }
}

async function getBlogPostById(id) {
  return await BlogPost.findById(id);
}

async function getUserByID(id) {
  return await User.findById(id);
}

// use chain middlewares to ensure authentication and ownership
export const ensureOwnership = chainMiddlewares(
  ensureAuthentication,
  async (req, res, next) => {
    const blogPost = await getBlogPostById(req.params.blogId);
    if (blogPost && req.user._id.toString() === blogPost.author.toString()) {
      return next();
    }
    res.redirect("/u/dashboard");
  });


export const getWriteBlogPage = chainMiddlewares(
  ensureAuthentication,
  async (req, res) => {
    res.render("write", {
      user: req.user,
    });
  });

export const writeBlogPost = chainMiddlewares(
  ensureAuthentication,
  async (req, res) => {
    const user = await getUserByID(req.user._id);
    const tags = req.body.tagsInput.split(",");

    const tagsToSave = [];
    for (const tag of tags) {
      const trimmedTag = tag.trim();
      if (trimmedTag.length === 0) continue;
      try {
        let existingTag = await Tag.findOne({ name: trimmedTag });

        if (!existingTag) {
          existingTag = new Tag({ name: trimmedTag });
          await existingTag.save();
        }

        tagsToSave.push(existingTag._id);
      } catch (error) {
        console.error("Error creating tag:", error);
      }
    }

    const blogPost = new BlogPost({
      title: req.body.title,
      content: req.body.content,
      author: user._id,
      publicationDate: Date.now(),
      lastUpdated: Date.now(),
      tags: tagsToSave,
    });

    await blogPost.save();
    res.redirect(`/blog/${blogPost._id}`);
});

export async function getBlogPageById(req, res) {
  try {
    const blogPost = await getBlogPostById(req.params.blogId);

    // Populate author information
    blogPost.author = await getUserByID(blogPost.author);

    // Populate comments information
    const comments = await Comment.find({
      blogPost: blogPost._id,
    }).populate("user");
    // Populate likes information
    const likes = await Like.find({
      blogPost: blogPost._id,
    }).populate("user");

    blogPost.comments = comments;
    blogPost.likes = likes;

    // Populate tags information
    blogPost.tags = await Promise.all(
      blogPost.tags.map(async (tagId) => {
        const tag = await Tag.findById(tagId);
        return tag;
      }),
    );

    // Fetch additional blog posts by the same author
    blogPost.author.blogPosts = await BlogPost.find({
      author: blogPost.author._id,
    });

    // if authenticated check if user liked the post
    if (req.isAuthenticated()) {
      const like = await Like.findOne({
        user: req.user._id,
        blogPost: blogPost._id,
      });
      if (like) {
        blogPost.liked = true;
      }
    }

    res.render("blog-post", {
      blogPost: blogPost,
      user: req.user,
    });
  } catch (error) {
    console.error("Error getting blog post:", error);
    res.status(500).send("Internal Server Error");
  }
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

export const getBlogEditPageById = chainMiddlewares(
  ensureOwnership,
  async (req, res) => {
    try {
      const blogPost = await getBlogPostById(req.params.blogId);
      await blogPost.populate("tags");

      res.render("blog-edit", {
        blogPost: blogPost,
        user: req.user,
      });
    } catch (error) {
      console.error("Error fetching blog post for edit:", error);
      res.redirect("/error");
    }
  });

export const editBlogPostById = chainMiddlewares(
  ensureOwnership,
  async function (req, res) {
  const tags = req.body.tagsInput.split(",");

  const tagsToSave = [];
  for (const tag of tags) {
    const trimmedTag = tag.trim();
    if (trimmedTag.length === 0) continue;
    try {
      let existingTag = await Tag.findOne({ name: trimmedTag });
      if (!existingTag) {
        existingTag = new Tag({ name: trimmedTag });
        await existingTag.save();
      }
      tagsToSave.push(existingTag._id);
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  }

  const updatedFields = {
    title: req.body.title,
    content: req.body.content,
    lastUpdated: Date.now(),
    tags: tagsToSave,
  };
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
});

export const deleteBlogPostById = chainMiddlewares(
  ensureOwnership,
  async (req, res) => {
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
});

// toggle like endpoint for AJAX requests
export async function likeBlogPost(req, res) {
  try {
    const blogPost = await getBlogPostById(req.params.blogId);
    const like = new Like({
      user: req.user._id,
      blogPost: blogPost._id,
    });
    // check if user already liked the post
    const alreadyLiked = await Like.findOne({
      user: req.user._id,
      blogPost: blogPost._id,
    });
    if (alreadyLiked) {
      await Like.findByIdAndDelete(alreadyLiked._id);
    } else {
      await like.save();
    }
    const numberOfLikes = await getNumberOfLikes(blogPost._id);
    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      numberOfLikes: numberOfLikes,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
}

export async function commentBlogPost(req, res) {
  try {
    const blogPost = await getBlogPostById(req.params.blogId);
    const comment = new Comment({
      user: req.user._id,
      blogPost: blogPost._id,
      text: req.body.content,
      createdAt: Date.now(),
    });
    await comment.save();
    res.status(200).json({ success: true, message: "Comment saved." });
  } catch (error) {
    console.error("Error commenting on blog post:", error);
    res.status(500).send("Internal Server Error");
  }
}

// AJAX endpoint for updating comment
export async function editCommentById(req, res) {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const result = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { $set: { text: req.body.text } },
      { new: true },
    );
    if (result) {
      res.status(200).json({ success: true, message: "Comment updated." });
    } else {
      res.status(404).send("Comment not found.");
    }
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).send("Internal Server Error");
  }
}

// AJAX endpoint for delete comment
export async function deleteCommentById(req, res) {
  try {
    const result = await Comment.findByIdAndDelete(req.params.commentId);
    if (result) {
      res.status(200).json({ success: true, message: "Comment deleted." });
    } else {
      res.status(404).send("Comment not found.");
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).send("Internal Server Error");
  }
}
