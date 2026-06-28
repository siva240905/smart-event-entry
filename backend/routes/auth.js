const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// @route   POST /api/auth/login
// @desc    Admin login and return JWT
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: admin._id,
      username: admin.username
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "super_secret_blitzmac_key_2026",
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          admin: {
            id: admin._id,
            username: admin.username
          }
        });
      }
    );

  } catch (error) {
    console.error("Login Route Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
