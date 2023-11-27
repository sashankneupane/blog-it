import Like from "../db/models/Like.mjs";

export const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { _id: userId } = req.user;

    const like = await Like.findOne({ user: userId, blogPost: blogId });

    if (like) {
      await like.remove();
      res.json({ success: true, message: "Like removed successfully." });
    } else {
      await Like.create({ user: userId, blogPost: blogId });
      res.json({ success: true, message: "Like added successfully." });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getLikes = async (req, res) => {
  try {
    const { blogId } = req.params;
    const likes = await Like.find({
      blogPost: blogId,
    }).populate("user");
    res.json({ success: true, likes });
  } catch (error) {
    console.error("Error getting likes:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
