const express = require("express");
const {
  subscribeNewsletter,
  getAllSubscribers,
} = require("../controllers/newsletterController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);
router.get("/subscribers", protect, admin, getAllSubscribers);

module.exports = router;
