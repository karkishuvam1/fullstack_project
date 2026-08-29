const Car = require("../models/Car");
const Order = require("../models/Order");
const User = require("../models/User");
const TestDrive = require("../models/TestDrive");
const Review = require("../models/Review");

// @desc    Get admin dashboard statistics (totals, revenue, recent orders)
// @route   GET /api/admin/stats
// @access  Private/Admin
async function getDashboardStats(req, res) {
  try {
    const totalCars = await Car.countDocuments();
    const activeCars = await Car.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalTestDrives = await TestDrive.countDocuments();
    const pendingTestDrives = await TestDrive.countDocuments({ status: "pending" });
    const totalReviews = await Review.countDocuments();

    // Total revenue calculation from completed/confirmed orders (or all non-cancelled)
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Month-to-date (MTD) revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const mtdRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: { $ne: "Cancelled" },
        },
      },
      { $group: { _id: null, mtdRevenue: { $sum: "$totalAmount" } } },
    ]);
    const mtdRevenue = mtdRevenueAgg.length > 0 ? mtdRevenueAgg[0].mtdRevenue : 0;

    // 5 most recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .populate("car", "name slug")
      .sort({ createdAt: -1 })
      .limit(5);

    // Formatted stats matching frontend Dashboard.jsx
    const statsCards = [
      { label: "Total Cars", value: String(totalCars), tone: "" },
      { label: "Active Listings", value: String(activeCars), tone: "green" },
      { label: "Total Orders", value: String(totalOrders), tone: "" },
      {
        label: "Revenue (MTD)",
        value: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(mtdRevenue),
        tone: "brass",
      },
    ];

    res.status(200).json({
      stats: statsCards,
      summary: {
        totalCars,
        activeCars,
        totalOrders,
        totalRevenue,
        mtdRevenue,
        totalUsers,
        totalTestDrives,
        pendingTestDrives,
        totalReviews,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD STATS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch dashboard stats" });
  }
}

module.exports = {
  getDashboardStats,
};

