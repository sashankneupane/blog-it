import mongoose from "mongoose";
import db from "../index.mjs";

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  blogPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogPost",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let Comment;
if (db.models.Comment) {
  Comment = db.model("Comment");
} else {
  Comment = db.model("Comment", commentSchema);
}

export default Comment;
