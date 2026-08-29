const express = require("express");
const router = express.Router();
const { subscribeNewsletter, getAllSubscribers } = require("../controllers/newsletterController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/subscribe", subscribeNewsletter);
router.get("/all", protect, admin, getAllSubscribers);

module.exports = router;
