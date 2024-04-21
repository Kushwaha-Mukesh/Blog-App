import jwt from "jsonwebtoken";

export const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ success: false, message: "Invalid Token!" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res
        .status(400)
        .json({ success: false, message: "Not Authenticated!" });
    }
    if (data) {
      req.userId = data.id;
      next();
    }
  });
};
