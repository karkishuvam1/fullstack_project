const express = require("express");
const { getDashboardStats } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(admin);

router.get("/stats", getDashboardStats);
router.get("/dashboard", getDashboardStats);

module.exports = router;

