const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Car name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Car slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Super Sports", "Super SUV", "Limited Edition", "Hypercars", "Luxury"],
      required: [true, "Category is required"],
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    power: {
      type: String,
      required: [true, "Power specification is required"],
    },
    engine: {
      type: String,
      required: [true, "Engine specification is required"],
    },
    topSpeed: {
      type: String,
      required: [true, "Top speed specification is required"],
    },
    zeroToHundred: {
      type: String,
      required: [true, "0-100 km/h acceleration specification is required"],
    },
    weight: {
      type: String,
      required: [true, "Weight specification is required"],
    },
    transmission: {
      type: String,
      default: "Automatic",
    },
    drivetrain: {
      type: String,
      default: "AWD",
    },
    image: {
      type: String,
      required: [true, "Main image URL is required"],
    },
    gallery: [
      {
        type: String,
      },
    ],
    blurb: {
      type: String,
      required: [true, "Short blurb is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    startingPrice: {
      type: Number,
      required: [true, "Starting price is required"],
      min: [0, "Price cannot be negative"],
    },
    features: [
      {
        type: String,
      },
    ],
    availableColors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
        price: { type: Number, default: 0 },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["Active", "Sold", "Draft"],
      default: "Active",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
