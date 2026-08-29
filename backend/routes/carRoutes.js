const express = require("express");
const router = express.Router();
const {
  getCars,
  getFeaturedCars,
  getCarBySlug,
  createCar,
  updateCar,
  deleteCar,
  addCarReview,
  getCarReviews,
} = require("../controllers/carController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", getCars);
router.get("/featured", getFeaturedCars);
router.get("/:slug", getCarBySlug);

router.post("/", protect, admin, createCar);
router.put("/:id", protect, admin, updateCar);
router.delete("/:id", protect, admin, deleteCar);

router.get("/:id/reviews", getCarReviews);
router.post("/:id/reviews", protect, addCarReview);

module.exports = router;
