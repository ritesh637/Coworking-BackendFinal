const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");

// Function to create a default admin
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10); // Set a strong password
      const admin = new User({
        email: "200101120110@cutm.ac.in",
        password: hashedPassword,
        username: "Default Admin",
        role: "admin",
      });
      await admin.save();
      console.log("✅ Default admin created!");
    } else {
      console.log("⚡ Admin already exists.");
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};

module.exports = { createDefaultAdmin };
