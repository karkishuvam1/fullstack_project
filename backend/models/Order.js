const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Car selection is required"],
    },
    orderType: {
      type: String,
      enum: ["reservation", "test-drive", "purchase"],
      default: "reservation",
    },
    customerDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, default: "" },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "Italy" },
    },
    configuration: {
      color: { type: String, default: "" },
      wheels: { type: String, default: "" },
      interior: { type: String, default: "" },
      selectedOptions: [{ type: String }],
    },
    pricing: {
      basePrice: { type: Number, default: 0 },
      optionsPrice: { type: Number, default: 0 },
      deliveryFee: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
      depositPaid: { type: Number, default: 0 },
      balanceDue: { type: Number, default: 0 },
    },
    testDriveDetails: {
      preferredDate: { type: Date },
      preferredTime: { type: String },
      dealer: { type: String },
    },
    deliveryOption: {
      type: String,
      enum: ["factory", "dealer", "home"],
      default: "dealer",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
