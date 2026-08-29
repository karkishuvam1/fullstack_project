const express = require("express");
const {
  bookTestDrive,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/testDriveController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", bookTestDrive);
router.post("/protected", protect, bookTestDrive);
router.get("/my-bookings", protect, getMyBookings);
router.get("/all", protect, admin, getAllBookings);
router.put("/:id/status", protect, admin, updateBookingStatus);

module.exports = router;
