import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
  if (!req.isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "You are unauthorized" });
  }
  if (!req.body.title || !req.body.content) {
    return res
      .status(401)
      .json({ success: false, message: "Title and Content required" });
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");
  try {
    const post = await Post.create({ userId: req.userId, slug, ...req.body });
    res.status(200).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Internal server error" });
  }
};
