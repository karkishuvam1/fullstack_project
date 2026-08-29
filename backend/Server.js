require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { seedData } = require("./seedData");

// Routes
const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const testDriveRoutes = require("./routes/testDriveRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");

// Middleware
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Connect Database and auto-seed initial data
connectDB().then(() => {
  seedData(true);
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Aurelia / Lamborghini Supercars API is running...");
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Test Drive routes (supports /api/testdrive, /api/test-drives, /api/testdrives)
app.use("/api/test-drives", testDriveRoutes);
app.use("/api/testdrive", testDriveRoutes);
app.use("/api/testdrives", testDriveRoutes);

// Newsletter routes (supports /api/newsletter and /api/newsletters)
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/newsletters", newsletterRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});