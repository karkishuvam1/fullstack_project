const Order = require("../models/Order");
const Car = require("../models/Car");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
async function createOrder(req, res) {
  try {
    const {
      car,
      orderItems,
      customer,
      deliveryAddress,
      paymentMethod,
      basePrice,
      customizationPrice,
      taxPrice,
      shippingPrice,
      totalAmount,
      notes,
    } = req.body;

    if (!totalAmount || Number(totalAmount) <= 0) {
      return res.status(400).json({ message: "A valid total amount is required for the order" });
    }

    // Verify car existence if a primary car ID is passed
    let primaryCar = car;
    if (primaryCar) {
      const carDoc = await Car.findById(primaryCar);
      if (!carDoc) {
        return res.status(404).json({ message: "Specified car not found" });
      }
    } else if (orderItems && orderItems.length > 0) {
      primaryCar = orderItems[0].car;
    }

    const orderData = {
      user: req.user._id,
      car: primaryCar,
      orderItems: orderItems || [],
      customer: customer || {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || "",
      },
      deliveryAddress: deliveryAddress || {},
      paymentMethod: paymentMethod || "Card",
      basePrice: basePrice || 0,
      customizationPrice: customizationPrice || 0,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalAmount: Number(totalAmount),
      notes: notes || "",
    };

    const order = await Order.create(orderData);

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("car", "name slug image startingPrice category")
      .populate("orderItems.car", "name slug image startingPrice category");

    res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
}

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("car", "name slug image startingPrice category")
      .populate("orderItems.car", "name slug image startingPrice category")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch orders" });
  }
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("car", "name slug image startingPrice category power engine topSpeed")
      .populate("orderItems.car", "name slug image startingPrice category");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow order owner or admin to access
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("GET ORDER BY ID ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch order" });
  }
}

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
async function getAllOrders(req, res) {
  try {
    const { status, limit, page } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    let query = Order.find(filter)
      .populate("user", "name email phone")
      .populate("car", "name slug image startingPrice")
      .populate("orderItems.car", "name slug image startingPrice")
      .sort({ createdAt: -1 });

    if (limit) {
      const pageSize = Number(limit) || 10;
      const pageNumber = Number(page) || 1;
      query = query.skip((pageNumber - 1) * pageSize).limit(pageSize);
    }

    const orders = await query.exec();
    const totalCount = await Order.countDocuments(filter);

    res.status(200).json({
      orders,
      totalCount,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch orders" });
  }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Processing", "Confirmed", "Completed", "Cancelled"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    if (status === "Completed" && !order.deliveredAt) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("car", "name slug image startingPrice");

    res.status(200).json({
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to update order status" });
  }
}

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
async function updateOrderToPaid(req, res) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id || req.body.paymentId,
      status: req.body.status || "COMPLETED",
      updateTime: req.body.updateTime || new Date().toISOString(),
      emailAddress: req.body.emailAddress || req.user.email,
    };

    if (order.status === "Pending") {
      order.status = "Confirmed";
    }

    await order.save();

    res.status(200).json({
      message: "Order paid successfully",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER TO PAID ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to update payment status" });
  }
}

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
async function deleteOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order removed successfully", id: req.params.id });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to delete order" });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updateOrderToPaid,
  deleteOrder,
};

