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
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Super Sports", "Super SUV", "Limited Edition", "Concept"],
      required: true,
      default: "Super Sports",
    },
    power: {
      type: String,
      required: true,
    },
    engine: {
      type: String,
      required: true,
    },
    topSpeed: {
      type: String,
      required: true,
    },
    zeroToHundred: {
      type: String,
      required: true,
    },
    zeroToSixty: {
      type: String,
      default: "",
    },
    weight: {
      type: String,
      required: true,
    },
    transmission: {
      type: String,
      default: "8-speed Dual-clutch",
    },
    drivetrain: {
      type: String,
      default: "AWD",
    },
    image: {
      type: String,
      required: true,
    },
    gallery: [
      {
        type: String,
      },
    ],
    blurb: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    availableColors: [
      {
        name: String,
        hex: String,
        price: { type: Number, default: 0 },
      },
    ],
    rating: {
      type: Number,
      default: 5.0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
