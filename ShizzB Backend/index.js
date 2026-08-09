require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const { secret } = require("./config/secret");
const PORT = secret.port || 7000;
const morgan = require("morgan");

// ==============================================
// Error Handler
// ==============================================

const globalErrorHandler = require("./middleware/global-error-handler");

// ==============================================
// Routes
// ==============================================

const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const userOrderRoutes = require("./routes/user.order.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const couponRoutes = require("./routes/coupon.routes");
const reviewRoutes = require("./routes/review.routes");
const adminRoutes = require("./routes/admin.routes");
const contactRoutes = require("./routes/contact.routes");
const blogRoutes = require("./routes/blog.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
// const uploadRouter = require("./routes/uploadFile.route");
const cloudinaryRoutes = require("./routes/cloudinary.routes");
const siteSettingsRoutes = require("./routes/siteSettings.routes");
const paymentRoutes = require("./routes/payment.routes");
console.log("Payment Routes Loaded");

// ==============================================
// Middleware
// ==============================================

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// ==============================================
// Database
// ==============================================

connectDB();

// ==============================================
// API Routes
// ==============================================

app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/product", productRoutes);
// app.use("/api/upload", uploadRouter);
app.use("/api/order", orderRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/user-order", userOrderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blog", blogRoutes);

// ================================
// Dashboard APIs
// ================================

app.use("/api/dashboard", dashboardRoutes);

// ================================
// Razorpay Payment APIs
// ================================

app.use("/api/payment", paymentRoutes);

// ================================
// Website Settings
// ================================

app.use("/api/settings", siteSettingsRoutes);

// ==============================================
// Root Route
// ==============================================

app.get("/", (req, res) => {
  res.send("Apps worked successfully");
});

// ==============================================
// Global Error Handler
// ==============================================

app.use(globalErrorHandler);

// ==============================================
// 404 Handler
// ==============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
});

// ==============================================
// Start Server
// ==============================================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;