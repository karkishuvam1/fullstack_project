const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

router.get("/wishlist", getWishlist);
router.post("/wishlist", addToWishlist);
router.delete("/wishlist/:carId", removeFromWishlist);

module.exports = router;
