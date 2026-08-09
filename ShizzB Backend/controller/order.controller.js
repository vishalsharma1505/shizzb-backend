const { secret } = require("../config/secret");
const stripe = require("stripe")(secret.stripe_key);
const Order = require("../model/Order");
const productServices = require("../services/product.service");

// ======================================================
// CREATE PAYMENT INTENT
// ======================================================

exports.paymentIntent = async (req, res, next) => {
  try {
    const { price } = req.body;

    if (!price || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const amount = Math.round(Number(price) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ======================================================
// CREATE ORDER
// ======================================================

exports.addOrder = async (req, res, next) => {

  try {

    const order = await Order.create(req.body);

    // ==========================================
    // Reduce Stock
    // ==========================================

    await productServices.decreaseStock(order.cart);

    // ==========================================
    // Payment Status
    // ==========================================

    if (order.paymentMethod === "Razorpay") {

  order.paymentStatus = "paid";

} else {

  order.paymentStatus = "pending";

}

    await order.save();

    return res.status(201).json({

      success: true,

      message: "Order placed successfully.",

      order,

    });

  } catch (error) {

    console.log(error);

    next(error);

  }

};

// ======================================================
// GET ALL ORDERS (ADMIN)
// ======================================================

exports.getOrders = async (req, res, next) => {

  try {

    const orders = await Order.find({})
      .populate("user")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({

      success: true,

      totalOrders: orders.length,

      data: orders,

    });

  } catch (error) {

    console.log(error);

    next(error);

  }

};

// ======================================================
// GET SINGLE ORDER
// ======================================================

exports.getSingleOrder = async (req, res, next) => {

  try {

    const order = await Order.findById(req.params.id).populate("user");

    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found.",

      });

    }

    return res.status(200).json({

      success: true,

      data: order,

    });

  } catch (error) {

    console.log(error);

    next(error);

  }

};
// ======================================================
// UPDATE ORDER STATUS (ADMIN)
// ======================================================

exports.updateOrderStatus = async (req, res, next) => {

  try {

    const {
      status,
      courierCompany,
      trackingNumber,
      trackingUrl,
      paymentStatus,
      adminNote,
      cancelReason,
      returnReason,
    } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // =====================================
    // STATUS UPDATE
    // =====================================

    if (status && status !== order.status) {

      // Restore Stock if Cancelled

      if (
        status === "cancelled" &&
        order.status !== "cancelled"
      ) {

        await productServices.increaseStock(order.cart);

        order.cancelledAt = new Date();

      }

      // Restore Stock if Returned

      if (
        status === "returned" &&
        order.status !== "returned"
      ) {

        await productServices.increaseStock(order.cart);

        order.returnedAt = new Date();

      }

      // Delivered Time

      if (status === "delivered") {

        order.deliveredAt = new Date();

      }

      order.status = status;

      order.statusHistory.push({
        status,
        updatedAt: new Date(),
      });

    }

    // =====================================
    // PAYMENT STATUS
    // =====================================

    if (paymentStatus !== undefined) {
      order.paymentStatus = paymentStatus;
    }

    // =====================================
    // COURIER DETAILS
    // =====================================

    if (courierCompany !== undefined) {
      order.courierCompany = courierCompany;
    }

    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }

    if (trackingUrl !== undefined) {
      order.trackingUrl = trackingUrl;
    }

    // =====================================
    // ADMIN NOTES
    // =====================================

    if (adminNote !== undefined) {
      order.adminNote = adminNote;
    }

    if (cancelReason !== undefined) {
      order.cancelReason = cancelReason;
    }

    if (returnReason !== undefined) {
      order.returnReason = returnReason;
    }

    await order.save();

    return res.status(200).json({

      success: true,

      message: "Order updated successfully.",

      data: order,

    });

  } catch (error) {

    console.log(error);

    next(error);

  }

};

// ======================================================
// CUSTOMER TRACK ORDER
// ======================================================

exports.getTrackingDetails = async (req, res, next) => {

  try {

    const order = await Order.findById(req.params.id);

    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found.",

      });

    }

    return res.status(200).json({

      success: true,

      data: {

        invoice: order.invoice,

        status: order.status,

        paymentStatus: order.paymentStatus,

        courierCompany: order.courierCompany,

        trackingNumber: order.trackingNumber,

        trackingUrl: order.trackingUrl,

        deliveredAt: order.deliveredAt,

        cancelledAt: order.cancelledAt,

        returnedAt: order.returnedAt,

        statusHistory: order.statusHistory,

      },

    });

  } catch (error) {

    console.log(error);

    next(error);

  }

};

// ======================================================
// GET SINGLE ORDER (ADMIN)
// ======================================================

exports.getOrderById = async (req, res, next) => {

  try {

    const order = await Order.findById(req.params.id)
      .populate("user");

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }

    res.status(200).json({
      success: true,
      data: order,
    });

  } catch (error) {

    console.log(error);
    next(error);

  }

};


// ======================================================
// UPDATE TRACKING DETAILS
// ======================================================

exports.updateTrackingDetails = async (req, res, next) => {

  try {

    const {
      courierCompany,
      trackingNumber,
      trackingUrl,
    } = req.body;

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    }

    order.courierCompany =
      courierCompany || "";

    order.trackingNumber =
      trackingNumber || "";

    order.trackingUrl =
      trackingUrl || "";

    await order.save();

    res.status(200).json({

      success: true,

      message:
        "Tracking details updated successfully",

      data: order,

    });

  } catch (error) {

    console.log(error);
    next(error);

  }

};