import mongoose from "mongoose";
import db from "../index.mjs";

const followingSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let Following;
if (db.models.Following) {
  Following = db.model("Following");
} else {
  Following = db.model("Following", followingSchema);
}

export default Following;
