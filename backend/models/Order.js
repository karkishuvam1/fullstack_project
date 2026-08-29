const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  customization: {
    color: {
      name: String,
      hex: String,
      price: { type: Number, default: 0 },
    },
    wheel: {
      id: String,
      name: String,
      price: { type: Number, default: 0 },
    },
    interior: {
      id: String,
      name: String,
      price: { type: Number, default: 0 },
    },
    options: [
      {
        id: String,
        name: String,
        price: { type: Number, default: 0 },
      },
    ],
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required for order"],
    },
    customer: {
      name: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
    },
    orderItems: [orderItemSchema],
    deliveryAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true },
      dealer: { type: String, trim: true },
    },
    paymentMethod: {
      type: String,
      default: "Card",
      trim: true,
    },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      emailAddress: String,
    },
    basePrice: {
      type: Number,
      default: 0,
    },
    customizationPrice: {
      type: Number,
      default: 0,
    },
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: 1000,
      default: "",
    },
  },
  { timestamps: true }
);

// Auto-generate human-readable orderId (e.g. ORD-1042) before saving if not present
orderSchema.pre("save", async function () {
  if (!this.orderId) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.orderId = `ORD-${randomNum}`;
  }
});

module.exports = mongoose.model("Order", orderSchema);

