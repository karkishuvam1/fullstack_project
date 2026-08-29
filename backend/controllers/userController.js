const User = require("../models/User");

// @desc    Get current user profile
// @route   GET /api/users/profile, GET /api/users/me
// @access  Private
async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch user profile" });
  }
}

// @desc    Update current user profile
// @route   PUT /api/users/profile, PUT /api/users/me
// @access  Private
async function updateUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, phone } = req.body;

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ message: "This email address is already in use" });
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to update profile" });
  }
}

// @desc    Update current user password
// @route   PUT /api/users/profile/password, PUT /api/users/me/password
// @access  Private
async function updateUserPassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both current and new password" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to update password" });
  }
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch users" });
  }
}

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("GET USER BY ID ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch user" });
  }
}

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
async function updateUserRole(req, res) {
  try {
    const { role } = req.body;

    if (!role || !["buyer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Valid role ('buyer' or 'admin') is required" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("UPDATE USER ROLE ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to update user role" });
  }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User removed successfully", id: req.params.id });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to delete user" });
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};

