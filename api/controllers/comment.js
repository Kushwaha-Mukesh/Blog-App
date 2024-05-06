import Comment from "../models/comment.model.js";

export const createComment = async (req, res) => {
  const { content, postId } = req.body;
  try {
    if (!content || !postId) {
      return res
        .status(403)
        .json({ success: false, message: "There is no comment" });
    }

    const comment = await Comment.create({
      content,
      postId,
      userId: req.userId,
    });
    res
      .status(200)
      .json({ success: true, message: "Comment created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error creating comment" });
  }
};

export const getComment = async (req, res) => {
  const { postId } = req.params;
  if (!postId) {
    return res
      .status(403)
      .json({ success: false, message: "You are not allowed to comment" });
  }

  try {
    const comments = await Comment.find({ postId: postId }).sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json(
        { success: false, message: "comments fetched successfully" },
        comments
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
