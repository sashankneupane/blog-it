import mongoose from "mongoose";

const dbURL = process.env.DSN;

mongoose.connect(dbURL);

const client = mongoose.connection;

client.on(
  "error",
  console.log.bind(console, "Connection error: Check your database connection"),
);
client.once("open", () => console.log("Connected to the database."));

const db = client.useDb("BlogIt");

export default db;