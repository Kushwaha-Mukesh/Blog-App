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
      data: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};
