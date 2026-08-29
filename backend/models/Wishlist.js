const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Car is required"],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
      index: true,
    },
    cars: [wishlistItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);

