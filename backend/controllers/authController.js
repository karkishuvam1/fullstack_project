const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new client user (always 'buyer' role)
// @route   POST /api/auth/register
// @access  Public
async function registerUser(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // STRICT: Public registrations are always assigned 'buyer' role
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      phone: phone ? phone.trim() : "",
      role: "buyer",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message || "Something went wrong. Please try again." });
  }
}

// @desc    Client login
// @route   POST /api/auth/login
// @access  Public
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter your email and password." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message || "Something went wrong. Please try again." });
  }
}

// @desc    Admin Portal login (strictly validates role === 'admin')
// @route   POST /api/auth/admin/login
// @access  Public (for administrators)
async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter your admin email and password." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Only authorized administrators can access this portal.",
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({ message: error.message || "Admin login error. Please try again." });
  }
}

module.exports = { registerUser, loginUser, adminLogin };