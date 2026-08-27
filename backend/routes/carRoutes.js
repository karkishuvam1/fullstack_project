const express = require("express");
const {
  getCars,
  getCarBySlug,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCars);
router.get("/:slug", getCarBySlug);

router.post("/", protect, admin, createCar);
router.put("/:id", protect, admin, updateCar);
router.delete("/:id", protect, admin, deleteCar);

module.exports = router;
