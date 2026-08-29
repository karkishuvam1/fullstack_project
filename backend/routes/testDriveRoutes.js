const express = require("express");
const router = express.Router();
const {
  bookTestDrive,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/testDriveController");
const { protect, optionalAuth, admin } = require("../middleware/authMiddleware");

router.post("/book", optionalAuth, bookTestDrive);
router.get("/my-bookings", protect, getMyBookings);
router.get("/all", protect, admin, getAllBookings);
router.put("/:id/status", protect, admin, updateBookingStatus);

module.exports = router;
