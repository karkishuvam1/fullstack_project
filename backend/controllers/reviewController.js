const Review = require("../models/Review");
const Car = require("../models/Car");

// @desc    Get all reviews for a specific car
// @route   GET /api/reviews/car/:carId
// @access  Public
async function getCarReviews(req, res) {
  try {
    const { carId } = req.params;

    const reviews = await Review.find({ car: carId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("GET CAR REVIEWS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch reviews" });
  }
}

// @desc    Create a review for a car
// @route   POST /api/reviews
// @access  Private
async function createReview(req, res) {
  try {
    const { car, rating, title, comment } = req.body;

    if (!car || !rating || !comment) {
      return res.status(400).json({ message: "Please provide car, rating, and comment" });
    }

    const carExists = await Car.findById(car);
    if (!carExists) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Check if user already reviewed this car
    const alreadyReviewed = await Review.findOne({ car, user: req.user._id });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this vehicle" });
    }

    const review = await Review.create({
      user: req.user._id,
      car,
      rating: Number(rating),
      title: title || "",
      comment: comment.trim(),
    });

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("car", "name slug");

    res.status(201).json({
      message: "Review submitted successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to submit review" });
  }
}

// @desc    Get reviews written by logged-in user
// @route   GET /api/reviews/my-reviews
// @access  Private
async function getMyReviews(req, res) {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("car", "name slug image")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("GET MY REVIEWS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch reviews" });
  }
}

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
async function updateReview(req, res) {
  try {
    const { rating, title, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    if (rating !== undefined) review.rating = Number(rating);
    if (title !== undefined) review.title = title.trim();
    if (comment !== undefined) review.comment = comment.trim();

    await review.save();

    res.status(200).json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("UPDATE REVIEW ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to update review" });
  }
}

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
async function deleteReview(req, res) {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Review deleted successfully", id: req.params.id });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to delete review" });
  }
}

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/all
// @access  Private/Admin
async function getAllReviews(req, res) {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("car", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("GET ALL REVIEWS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch all reviews" });
  }
}

module.exports = {
  getCarReviews,
  createReview,
  getMyReviews,
  updateReview,
  deleteReview,
  getAllReviews,
};

