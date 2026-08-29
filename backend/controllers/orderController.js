const Order = require("../models/Order");
const Car = require("../models/Car");
const sendEmail = require("../utils/sendEmail");

async function createOrder(req, res) {
  try {
    const {
      carId,
      carSlug,
      orderType = "reservation",
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      configuration,
      deposit = 10000,
      deliveryOption = "dealer",
      notes,
      preferredDate,
      preferredTime,
      dealer,
    } = req.body;

    let car;
    if (carId) {
      car = await Car.findById(carId);
    } else if (carSlug) {
      car = await Car.findOne({ slug: carSlug });
    }

    if (!car) {
      return res.status(404).json({ message: "Vehicle model not found" });
    }

    const customerEmail = email || req.user?.email;
    const customerName = firstName || req.user?.name || "Valued Client";

    if (!customerEmail || !phone) {
      return res.status(400).json({ message: "Contact email and phone number are required" });
    }

    const basePrice = car.startingPrice || 350000;
    const deliveryFee = deliveryOption === "factory" ? 3500 : deliveryOption === "home" ? 1500 : 0;
    const tax = Math.round(basePrice * 0.22);
    const totalAmount = basePrice + deliveryFee + tax;
    const depositPaid = Number(deposit) || 5000;
    const balanceDue = totalAmount - depositPaid;

    const orderData = {
      car: car._id,
      orderType: orderType || "reservation",
      customerDetails: {
        firstName: customerName.split(" ")[0],
        lastName: lastName || customerName.split(" ").slice(1).join(" "),
        email: customerEmail,
        phone,
        address: address || "",
        city: city || "",
        postalCode: postalCode || "",
        country: country || "Italy",
      },
      configuration: configuration || {},
      pricing: {
        basePrice,
        deliveryFee,
        tax,
        totalAmount,
        depositPaid,
        balanceDue,
      },
      deliveryOption,
      notes: notes || "",
      status: "pending",
    };

    if (req.user) {
      orderData.user = req.user._id;
    }

    if (preferredDate) {
      orderData.testDriveDetails = {
        preferredDate: new Date(preferredDate),
        preferredTime: preferredTime || "10:00 AM",
        dealer: dealer || "Sant'Agata Bolognese — Flagship Store",
      };
    }

    const order = await Order.create(orderData);
    const populated = await Order.findById(order._id).populate("car").populate("user", "name email");

    // Send confirmation email
    sendEmail({
      to: customerEmail,
      subject: `Lamborghini Reservation Confirmed #${order._id.toString().slice(-6).toUpperCase()}`,
      html: `
        <h2>Order Confirmation: Lamborghini ${car.name}</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for placing your vehicle reservation. Your client concierge will contact you within 24 hours.</p>
        <p><strong>Reservation Reference:</strong> #${order._id.toString().slice(-6).toUpperCase()}</p>
        <p><strong>Deposit Paid:</strong> &euro;${depositPaid.toLocaleString()}</p>
        <p><strong>Total Estimated:</strong> &euro;${totalAmount.toLocaleString()}</p>
      `,
    }).catch(() => {});

    res.status(201).json({
      message: "Order placed successfully",
      order: populated,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
}

async function getMyOrders(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const orders = await Order.find({
      $or: [{ user: req.user._id }, { "customerDetails.email": req.user.email }],
    })
      .populate("car")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch orders" });
  }
}

async function getAllOrders(req, res) {
  try {
    const { status, type } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }
    if (type && type !== "all") {
      filter.orderType = type;
    }

    const orders = await Order.find(filter)
      .populate("car")
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch all orders" });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate("car")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      req.user.role !== "admin" &&
      String(order.user?._id) !== String(req.user._id) &&
      order.customerDetails?.email !== req.user.email
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch order" });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "processing", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    const updated = await Order.findById(order._id)
      .populate("car")
      .populate("user", "name email");

    res.status(200).json({
      message: "Order status updated successfully",
      order: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update order status" });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
