const mongoose = require("mongoose");

const testDriveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Please select a car for the test drive"],
    },
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    preferredDate: {
      type: Date,
      required: [true, "Please select a preferred date"],
    },
    preferredTime: {
      type: String,
      required: [true, "Please select a preferred time"],
    },
    dealer: {
      type: String,
      required: [true, "Please select a preferred dealer"],
    },
    message: {
      type: String,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestDrive", testDriveSchema);
