const express = require("express");

const {
  paymentIntent,
  addOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
  getTrackingDetails,

  // ===============================
  // ADMIN FUNCTIONS
  // ===============================
  getOrderById,
  updateTrackingDetails,
} = require("../controller/order.controller");

const router = express.Router();

// ===================================================
// PAYMENT
// ===================================================

router.post(
  "/create-payment-intent",
  paymentIntent
);

// ===================================================
// CUSTOMER ROUTES
// ===================================================

// Place Order
router.post(
  "/saveOrder",
  addOrder
);

// Track Order
router.get(
  "/track/:id",
  getTrackingDetails
);

// ===================================================
// ADMIN ROUTES
// IMPORTANT:
// ALL ADMIN ROUTES MUST COME BEFORE "/:id"
// ===================================================

// All Orders
router.get(
  "/admin/all",
  getOrders
);

// Single Order Details
router.get(
  "/admin/details/:id",
  getOrderById
);

// Update Status
router.patch(
  "/admin/update-status/:id",
  updateOrderStatus
);

// Update Tracking
router.patch(
  "/admin/update-tracking/:id",
  updateTrackingDetails
);

// ===================================================
// CUSTOMER SINGLE ORDER
// MUST BE LAST
// ===================================================

router.get(
  "/:id",
  getSingleOrder
);

// ===================================================

module.exports = router;