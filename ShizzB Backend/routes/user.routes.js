const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

// =========================
// Test
// =========================
router.get("/test", (req, res) => {
  res.json({ message: "User routes working 🚀" });
});

// =========================
// Authentication
// =========================
router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.patch("/forget-password", userController.forgetPassword);

router.patch(
  "/confirm-forget-password",
  userController.confirmForgetPassword
);

router.patch("/change-password", userController.changePassword);
router.patch(
  "/admin/change-password",
  userController.changeAdminPassword
);

router.get(
  "/confirmEmail/:token",
  userController.confirmEmail
);

router.put(
  "/update-user/:id",
  userController.updateUser
);

// Google Login/Register
router.post(
  "/register/:token",
  userController.signUpWithProvider
);

// ===================================================
// ADMIN CUSTOMER MANAGEMENT
// ===================================================

// All Customers
router.get(
  "/admin/customers",
  userController.getAllCustomers
);

// Delete Customer
router.delete(
  "/admin/customer/:id",
  userController.deleteCustomer
);

module.exports = router;