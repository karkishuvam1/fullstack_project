const mongoose = require("mongoose");
const Wishlist = require("../models/Wishlist");
const Car = require("../models/Car");

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
async function getWishlist(req, res) {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "cars.car",
      "name slug category startingPrice image power engine topSpeed zeroToHundred availableColors inStock"
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, cars: [] });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch wishlist" });
  }
}

// @desc    Add a car to wishlist
// @route   POST /api/wishlist, POST /api/wishlist/:carId
// @access  Private
async function addToWishlist(req, res) {
  try {
    const carId = req.params.carId || req.body.carId;

    if (!carId) {
      return res.status(400).json({ message: "Car ID is required" });
    }

    let car = null;
    if (mongoose.Types.ObjectId.isValid(carId)) {
      car = await Car.findById(carId);
    }
    if (!car) {
      car = await Car.findOne({ slug: String(carId).toLowerCase() });
    }
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    const resolvedCarId = car._id;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, cars: [] });
    }

    const alreadyInWishlist = wishlist.cars.some(
      (item) => item.car.toString() === resolvedCarId.toString()
    );

    if (alreadyInWishlist) {
      return res.status(400).json({ message: "Car is already in your wishlist" });
    }

    wishlist.cars.unshift({ car: resolvedCarId, addedAt: new Date() });
    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
      "cars.car",
      "name slug category startingPrice image power engine topSpeed zeroToHundred availableColors inStock"
    );

    res.status(200).json({
      message: "Car added to wishlist",
      wishlist: populatedWishlist,
    });
  } catch (error) {
    console.error("ADD TO WISHLIST ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to add car to wishlist" });
  }
}

// @desc    Remove a car from wishlist
// @route   DELETE /api/wishlist/:carId
// @access  Private
async function removeFromWishlist(req, res) {
  try {
    const { carId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.cars = wishlist.cars.filter(
      (item) => item.car.toString() !== carId.toString()
    );

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
      "cars.car",
      "name slug category startingPrice image power engine topSpeed zeroToHundred availableColors inStock"
    );

    res.status(200).json({
      message: "Car removed from wishlist",
      wishlist: populatedWishlist,
    });
  } catch (error) {
    console.error("REMOVE FROM WISHLIST ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to remove car from wishlist" });
  }
}

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
async function clearWishlist(req, res) {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
      wishlist.cars = [];
      await wishlist.save();
    }

    res.status(200).json({ message: "Wishlist cleared successfully", cars: [] });
  } catch (error) {
    console.error("CLEAR WISHLIST ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to clear wishlist" });
  }
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};

