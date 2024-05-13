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
    res.status(401).json({ success: false, message: "Internal server error" });
    console.log(error.message);
  }
};

export const getPosts = async (req, res) => {
  try {
    const startIdx = parseInt(req.query.startIdx) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sort = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
          { category: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sort })
      .skip(startIdx)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const now = new Date();
    now.setMonth(now.getMonth() - 1); // here setting previous month

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: now },
    });

    res.status(200).json({
      success: true,
      message: "Here is all your post",
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updatePost = async (req, res) => {
  if (!req.isAdmin || !req.userId) {
    return res
      .status(403)
      .json({ success: false, message: "You are not allowed to update post." });
  }

  try {
    const postId = req.params.postId;
    const userId = req.userId;
    if (req.body.title) {
      const slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "-");

      req.body.slug = slug;
    }
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, userId },
      { ...req.body },
      { returnOriginal: false }
    );

    res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating post" });
  }
};

export const deletePost = async (req, res) => {
  if (!req.isAdmin || !req.userId) {
    return res.status(403).json({
      success: false,
      message: "You are not allowd to delete this post.",
    });
  }
  try {
    const deletePost = await Post.findOneAndDelete({
      _id: req.params.postId,
      userId: req.userId,
    });
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error deleting post" });
  }
};
