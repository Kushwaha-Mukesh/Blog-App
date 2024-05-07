import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    });
    updatedUser.password = undefined;
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      newUser: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

export const getUsers = async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to get users details.",
    });
  }
  try {
    const startIdx = parseInt(req.query.startIdx) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: sortOrder })
      .skip(startIdx)
      .limit(limit);

    const totalUsers = await User.countDocuments();
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: now },
    });
    res.status(200).json({
      success: true,
      message: "All users details",
      users,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.userId });
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

export const signOut = async (req, res) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ success: true, message: "User signed out successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getOneUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.userId });
    res
      .status(200)
      .json({ success: true, message: "User fetched successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
