const User = require("../models/User");
const Car = require("../models/Car");
const Order = require("../models/Order");
const Newsletter = require("../models/Newsletter");

async function getDashboardStats(req, res) {
  try {
    const [totalCars, totalUsers, totalOrders, orders] = await Promise.all([
      Car.countDocuments({ isActive: true }),
      User.countDocuments(),
      Order.countDocuments(),
      Order.find(),
    ]);

    const totalRevenue = orders.reduce((sum, o) => {
      const amt = o.pricing?.totalAmount || (o.pricing?.depositPaid ? o.pricing.depositPaid * 5 : 0);
      return sum + (amt || 0);
    }, 0);

    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const confirmedOrders = orders.filter((o) => o.status === "confirmed").length;

    res.status(200).json({
      cars: totalCars,
      users: totalUsers,
      orders: totalOrders,
      revenue: totalRevenue,
      pendingOrders,
      confirmedOrders,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch admin stats" });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch users" });
  }
}

async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    if (!["user", "buyer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: `User role updated to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update user role" });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete user" });
  }
}

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
