import mongoose from "mongoose";
import db from "../index.mjs";

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

let Tag;
if (db.models.Tag) {
  Tag = db.model("Tag");
} else {
  Tag = db.model("Tag", tagSchema);
}

export default Tag;
