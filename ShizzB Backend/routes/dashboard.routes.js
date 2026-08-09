const express = require("express");

const {
  getDashboardSummary,
  getMonthlySales,
  getRecentOrders,
  getLatestCustomers,
  getDashboardCounts,
  getBestSellingProducts,
  getLowStockProducts,
  getOutOfStockProducts,
  getLatestProducts,
} = require("../controller/dashboard.controller");

const router = express.Router();

// =======================================================
// DASHBOARD SUMMARY
// =======================================================

// Dashboard Cards
router.get("/summary", getDashboardSummary);

// =======================================================
// TODAY COUNTS
// =======================================================

router.get("/counts", getDashboardCounts);

// =======================================================
// SALES GRAPH
// =======================================================

// Monthly Revenue Graph
router.get("/monthly-sales", getMonthlySales);

// =======================================================
// RECENT ORDERS
// =======================================================

router.get("/recent-orders", getRecentOrders);

// =======================================================
// LATEST CUSTOMERS
// =======================================================

router.get("/latest-customers", getLatestCustomers);

// =======================================================
// BEST SELLING PRODUCTS
// =======================================================

router.get("/best-selling-products", getBestSellingProducts);

// =======================================================
// LOW STOCK PRODUCTS
// =======================================================

router.get("/low-stock-products", getLowStockProducts);

// =======================================================
// OUT OF STOCK PRODUCTS
// =======================================================

router.get("/out-of-stock-products", getOutOfStockProducts);

// =======================================================
// LATEST PRODUCTS
// =======================================================

router.get("/latest-products", getLatestProducts);

module.exports = router;