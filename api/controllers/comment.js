import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

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

export const editComment = async (req, res) => {
  if (!req.params.id || !req.body.content) {
    return res.status.json({ success: false, message: "invalid edit comment" });
  }

  try {
    const findComment = await Comment.findById(req.params.id);

    if (findComment.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "you are not allowed to edit comment.",
      });
    }

    const comment = await Comment.findByIdAndUpdate(
      { _id: req.params.id },
      { content: req.body.content },
      { new: true }
    );
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "comment not found" });
    }

    res.status(200).json({ success: true, message: "comment edited", comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  if (!req.params.id) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid delete request" });
  }
  try {
    const findComment = await Comment.findById(req.params.id);
    if (!findComment) {
      return res
        .status(403)
        .json({ success: false, message: "invalid delete request" });
    }
    if (findComment.userId.toString() !== req.userId && !req.isAdmin) {
      // one more validation can be added to this endpoint that
      // if user is not the owner of comment then user can not allowed to delete or edit the comment.
      return res.status(403).json({
        success: false,
        message: "You are not allowd to delete comment.",
      });
    }

    const comment = await Comment.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "comment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

export const getAllComments = async (req, res) => {
  if (!req.isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "you are not authorized" });
  }

  try {
    const startIdx = parseInt(req.params.startIdx) || 0;
    const limit = parseInt(req.params.limit) || 9;
    const sortDirection = req.params.order === "asc" ? 1 : -1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIdx)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: now },
    });

    const posts = [];
    const users = [];

    for (let comment of comments) {
      const post = await Post.findById(comment.postId);
      const postObj = {
        title: post.title,
        slug: post.slug,
      };
      posts.push(postObj);
      const user = await User.findById(comment.userId);
      const userObj = {
        name: user.name,
        image: user.profilePicture,
      };
      users.push(userObj);
    }

    res.status(200).json({
      success: true,
      message: "Fetched all comments",
      comments,
      totalComments,
      lastMonthComments,
      posts,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};
