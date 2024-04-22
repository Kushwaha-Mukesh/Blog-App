import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(403)
      .json({ success: false, message: "All credentials required" });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(403)
      .json({ success: false, message: "User already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });
  } catch (error) {
    console.log(error);
    res
      .status(403)
      .json({ success: false, message: "Error registering user!" });
  }

  res.status(200).json({ success: true, message: "User SignUp Successfully" });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(403)
      .json({ success: false, message: "All fields are required!" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user do not exits!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(403)
        .json({ success: false, message: "Credentials do not match!" });
    }

    user.password = undefined;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).cookie("token", token, { httpOnly: true }).json({
      success: true,
      message: "User Sign In Successfully",
      newUser: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const google = async (req, res) => {
  const { name, email, googlePhotoUrl } = req.body;
  if (!name || !email || !googlePhotoUrl) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid credentials!" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      user.password = undefined;
      res
        .status(200)
        .cookie("token", token, { httpOnly: true })
        .json({ success: true, message: "sign in successfull!", user });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashPassword,
        profilePicture: googlePhotoUrl,
      });
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      newUser.password = undefined;
      res
        .status(200)
        .cookie("token", token, { httpOnly: true })
        .json({ success: true, message: "sign in successfull!", newUser });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "server google authentication error" });
  }
};
