const express = require("express");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // All wishlist routes require authentication

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.post("/:carId", addToWishlist);
router.delete("/:carId", removeFromWishlist);
router.delete("/", clearWishlist);

module.exports = router;

