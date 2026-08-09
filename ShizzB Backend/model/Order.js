const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cart: [
      {
        type: Object,
      },
    ],

    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    contact: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    zipCode: {
      type: String,
      required: true,
      trim: true,
    },

    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },

    shippingCost: {
      type: Number,
      required: true,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    shippingOption: {
      type: String,
      default: "",
    },

    cardInfo: {
      type: Object,
      default: null,
    },

    paymentIntent: {
      type: Object,
      default: null,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
      lowercase: true,
    },

    orderNote: {
      type: String,
      default: "",
    },

    invoice: {
      type: Number,
      unique: true,
    },

    // ==========================
    // ORDER STATUS
    // ==========================

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out for delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
      lowercase: true,
    },

    // ==========================
    // STATUS HISTORY
    // ==========================

    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "out for delivery",
            "delivered",
            "cancelled",
            "returned",
          ],
        },

        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ==========================
    // COURIER DETAILS
    // ==========================

    courierCompany: {
      type: String,
      default: "",
    },

    trackingNumber: {
      type: String,
      default: "",
    },

    trackingUrl: {
      type: String,
      default: "",
    },

    // ==========================
    // ADMIN
    // ==========================

    adminNote: {
      type: String,
      default: "",
    },

    cancelReason: {
      type: String,
      default: "",
    },

    returnReason: {
      type: String,
      default: "",
    },

    // ==========================
    // IMPORTANT DATES
    // ==========================

    confirmedAt: {
      type: Date,
      default: null,
    },

    processingAt: {
      type: Date,
      default: null,
    },

    shippedAt: {
      type: Date,
      default: null,
    },

    outfordeliveryAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    returnedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ===========================================
// Generate Invoice Number
// + First Status History
// ===========================================

orderSchema.pre("save", async function () {

  if (!this.invoice) {

    const lastOrder = await mongoose
      .model("Order")
      .findOne({})
      .sort({ invoice: -1 })
      .select("invoice");

    this.invoice = lastOrder
      ? lastOrder.invoice + 1
      : 1000;
  }

  if (
    this.isNew &&
    (!this.statusHistory || this.statusHistory.length === 0)
  ) {

    this.statusHistory.push({
      status: this.status || "pending",
      updatedAt: new Date(),
    });

  }

});

const Order =
  mongoose.models.Order ||
  mongoose.model("Order", orderSchema);

module.exports = Order;