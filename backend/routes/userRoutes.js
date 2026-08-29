const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Current user profile endpoints
router.get("/profile", protect, getUserProfile);
router.get("/me", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/me", protect, updateUserProfile);
router.put("/profile/password", protect, updateUserPassword);
router.put("/me/password", protect, updateUserPassword);

// Admin user management endpoints
router.get("/", protect, admin, getAllUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id/role", protect, admin, updateUserRole);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;

