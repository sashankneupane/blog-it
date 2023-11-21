import mongoose from "mongoose";
import db from "../index.mjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
});

let User;
if (db.models.User) {
  User = db.model("User");
} else {
  User = db.model("User", userSchema);
}

export default User;
