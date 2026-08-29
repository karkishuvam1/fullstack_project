const express = require("express");
const {
  getCarReviews,
  createReview,
  getMyReviews,
  updateReview,
  deleteReview,
  getAllReviews,
} = require("../controllers/reviewController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/car/:carId", getCarReviews);
router.get("/my-reviews", protect, getMyReviews);
router.get("/all", protect, admin, getAllReviews);

router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;

