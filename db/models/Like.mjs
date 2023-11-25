import mongoose from "mongoose";
import db from "../index.mjs";

const likeSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let Like;
if (db.models.Like) {
  Like = db.model("Like");
} else {
  Like = db.model("Like", likeSchema);
}

export default Like;
