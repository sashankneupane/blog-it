import mongoose from "mongoose";
import db from "../index.mjs";

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  publicationDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
});

let BlogPost;
if (db.models.BlogPost) {
  BlogPost = db.model("BlogPost");
} else {
  BlogPost = db.model("BlogPost", blogPostSchema);
}
export default BlogPost;
