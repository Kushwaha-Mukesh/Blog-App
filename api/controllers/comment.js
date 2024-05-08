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
    res.status(200).json({
      success: true,
      message: "Comment created successfully",
      comment,
    });
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
    res.status(200).json({
      success: false,
      message: "comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    const alreadyliked = comment.likes.indexOf(req.userId);
    if (alreadyliked > -1) {
      comment.likes.splice(alreadyliked, 1);
    } else {
      comment.likes.push(req.userId);
    }
    comment.numberOfLikes = comment.likes.length;
    await comment.save();
    res
      .status(200)
      .json({ success: true, message: "you like a comment.", comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
