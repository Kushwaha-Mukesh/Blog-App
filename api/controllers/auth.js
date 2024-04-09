import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

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
      .json({ success: true, message: "User already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const data = {
    name,
    email,
    password: hashPassword,
  };

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

  res
    .status(200)
    .json({ success: true, message: "User SignUp Successfully", data });
};
