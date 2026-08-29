const TestDrive = require("../models/TestDrive");
const Car = require("../models/Car");

async function bookTestDrive(req, res) {
  try {
    const {
      car,
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      dealer,
      message,
    } = req.body;

    if (!car || !name || !email || !phone || !preferredDate || !preferredTime || !dealer) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const carExists = await Car.findById(car);
    if (!carExists) {
      return res.status(404).json({ message: "Selected car not found" });
    }

    const bookingData = {
      car,
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      dealer,
      message,
    };

    if (req.user) {
      bookingData.user = req.user._id;
    }

    const testDrive = await TestDrive.create(bookingData);

    const populatedBooking = await TestDrive.findById(testDrive._id)
      .populate("car", "name slug image")
      .populate("user", "name email");

    res.status(201).json({
      message: "Test drive booked successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("TEST DRIVE BOOKING ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to book test drive" });
  }
}

async function getMyBookings(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const bookings = await TestDrive.find({ user: req.user._id })
      .populate("car", "name slug image")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("GET MY BOOKINGS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch bookings" });
  }
}

async function getAllBookings(req, res) {
  try {
    const bookings = await TestDrive.find()
      .populate("car", "name slug image")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("GET ALL BOOKINGS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch bookings" });
  }
}

async function updateBookingStatus(req, res) {
  try {
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await TestDrive.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await TestDrive.findById(booking._id)
      .populate("car", "name slug image")
      .populate("user", "name email");

    res.status(200).json({
      message: "Booking status updated",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("UPDATE BOOKING STATUS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to update booking" });
  }
}

module.exports = {
  bookTestDrive,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
};
