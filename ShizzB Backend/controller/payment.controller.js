const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Order = require("../model/Order");

// ==========================================
// Create Razorpay Order
// ==========================================

exports.createOrder = async (req, res) => {
try {
const { amount } = req.body;


const options = {
  amount: amount * 100,
  currency: "INR",
  receipt: "receipt_" + Date.now(),
};

const order = await razorpay.orders.create(options);

res.status(200).json({
  success: true,
  order,
});


} catch (err) {


console.log(err);

res.status(500).json({
  success: false,
  message: err.message,
});


}
};

// ==========================================
// Verify Razorpay Payment
// ==========================================

exports.verifyPayment = async (req, res) => {

try {


const {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  orderId,
} = req.body;

const body =
  razorpay_order_id + "|" + razorpay_payment_id;

const expectedSignature = crypto
  .createHmac(
    "sha256",
    process.env.RAZORPAY_KEY_SECRET
  )
  .update(body.toString())
  .digest("hex");

if (expectedSignature !== razorpay_signature) {

  return res.status(400).json({
    success: false,
    message: "Invalid payment signature",
  });

}

// ======================================
// Update Order
// ======================================

const order = await Order.findById(orderId);

if (!order) {

  return res.status(404).json({
    success: false,
    message: "Order not found",
  });

}

order.paymentStatus = "paid";
order.paymentMethod = "Razorpay";

await order.save();

res.status(200).json({
  success: true,
  message: "Payment verified successfully",
});


} catch (err) {


console.log(err);

res.status(500).json({
  success: false,
  message: err.message,
});


}

};
