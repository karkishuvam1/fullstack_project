const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Car is required"],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      default: "",
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent user from submitting multiple reviews for the same car
reviewSchema.index({ car: 1, user: 1 }, { unique: true });

// Static method to recalculate and update average rating and review count on Car
reviewSchema.statics.calculateAverageRating = async function (carId) {
  const stats = await this.aggregate([
    { $match: { car: new mongoose.Types.ObjectId(carId) } },
    {
      $group: {
        _id: "$car",
        numReviews: { $sum: 1 },
        rating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    const Car = mongoose.model("Car");
    if (stats.length > 0) {
      await Car.findByIdAndUpdate(carId, {
        rating: Math.round(stats[0].rating * 10) / 10,
        numReviews: stats[0].numReviews,
      });
    } else {
      await Car.findByIdAndUpdate(carId, {
        rating: 0,
        numReviews: 0,
      });
    }
  } catch (error) {
    console.error("Error updating car rating stats:", error);
  }
};

// Call calculateAverageRating after save
reviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.car);
});

// Call calculateAverageRating after delete
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.car);
  }
});

module.exports = mongoose.model("Review", reviewSchema);

