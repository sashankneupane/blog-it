import BlogPost from "../db/models/Blogpost.mjs";
import User from "../db/models/User.mjs";
import Tag from "../db/models/Tag.mjs";

async function getBlogPosts(query) {
  let blogPosts;
  const filter = {};

  if (query.search) {
    const regexPattern = new RegExp(query.search, "i");
    filter.$or = [{ title: regexPattern }, { content: regexPattern }];
  }

  if (query.author) {
    try {
      const author = await User.findOne({ username: query.author });
      filter.author = author._id;
    } catch (error) {
      console.error("No such author:", error);
    }
  }

  if (query.keyword) {
    const regexPattern = new RegExp(query.keyword, "i");
    filter.$or = [{ title: regexPattern }, { content: regexPattern }];
  }

  if (query.tag) {
    const tagName = query.tag.toLowerCase();
    const tag = await Tag.findOne({ name: tagName });
    if (tag) {
      filter.tags = { $in: [tag._id] };
    }
  }

  try {
    blogPosts = await BlogPost.find(filter).populate("author").populate("tags");
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }
  return blogPosts;
}

export async function getHomePage(req, res) {
  const data = {};
  data.blogPosts = await getBlogPosts(req.query);
  // Fetch popular tags
  data.popularTags = await BlogPost.aggregate([
    {
      $unwind: "$tags",
    },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "_id",
        foreignField: "_id",
        as: "tagInfo",
      },
    },
    {
      $unwind: "$tagInfo",
    },
    {
      $project: {
        name: "$tagInfo.name",
        count: 1,
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 3,
    },
  ]);

  // Fetch popular authors
  data.popularAuthors = await BlogPost.aggregate([
    {
      $group: {
        _id: "$author",
        averageLikes: {
          $avg: { $cond: [{ $isArray: "$likes" }, { $size: "$likes" }, 0] },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "authorInfo",
      },
    },
    {
      $unwind: "$authorInfo",
    },
    {
      $project: {
        username: "$authorInfo.username",
        averageLikes: 1,
      },
    },
    {
      $sort: { averageLikes: -1 },
    },
    {
      $limit: 3,
    },
  ]);

  res.render("home", {
    data: data,
    query: req.query,
    user: req.user,
  });
}

export async function redirectToHomePage(req, res) {
  res.redirect("/home");
}
