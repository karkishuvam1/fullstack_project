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
    },
    category: {
      type: String,
      enum: ["Super Sports", "Super SUV", "Limited Edition"],
      required: true,
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
    weight: {
      type: String,
      required: true,
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
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
