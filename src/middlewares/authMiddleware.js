const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found." });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized." });
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admins only." });
  next();
};

module.exports = { authMiddleware, adminMiddleware };
