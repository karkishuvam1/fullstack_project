const User = require("../models/User");
const Wishlist = require("../models/Wishlist");
const Car = require("../models/Car");

async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch user profile" });
  }
}

async function updateUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    if (req.body.address) {
      user.address = { ...user.address, ...req.body.address };
    }
    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updated = await user.save();

    res.status(200).json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      avatar: updated.avatar,
      phone: updated.phone,
      address: updated.address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update profile" });
  }
}

async function getWishlist(req, res) {
  try {
    const items = await Wishlist.find({ user: req.user._id }).populate("car");
    const cars = items.filter((i) => i.car).map((i) => i.car);
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch wishlist" });
  }
}

async function addToWishlist(req, res) {
  try {
    const { carId } = req.body;
    if (!carId) {
      return res.status(400).json({ message: "Car ID is required" });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const existing = await Wishlist.findOne({ user: req.user._id, car: carId });
    if (!existing) {
      await Wishlist.create({ user: req.user._id, car: carId });
    }

    res.status(200).json({ message: "Car added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to add to wishlist" });
  }
}

async function removeFromWishlist(req, res) {
  try {
    const { carId } = req.params;
    await Wishlist.findOneAndDelete({ user: req.user._id, car: carId });
    res.status(200).json({ message: "Car removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to remove from wishlist" });
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
