const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require("validator");

// =======================================================
// Product Schema
// =======================================================

const productsSchema = mongoose.Schema(
  {
    sku: {
      type: String,
      required: false,
    },

    img: {
      type: String,
      required: true,
      validate: [validator.isURL, "Please provide valid url(s)"],
    },

    title: {
      type: String,
      required: [true, "Please provide a name for this product."],
      trim: true,
      minLength: [3, "Name must be at least 3 characters."],
      maxLength: [200, "Name is too large"],
    },

    slug: {
      type: String,
      trim: true,
    },

    unit: {
      type: String,
      required: true,
    },

    imageURLs: [
      {
        color: {
          name: {
            type: String,
            trim: true,
          },
          clrCode: {
            type: String,
            trim: true,
          },
        },

        img: {
          type: String,
          validate: [validator.isURL, "Please provide valid url(s)"],
        },

        sizes: [String],
      },
    ],

    parent: {
      type: String,
      required: true,
      trim: true,
    },

    children: {
  type: String,
  required: false,
  default: "",
  trim: true,
},

    price: {
      type: Number,
      required: true,
      min: [0, "Product price can't be negative"],
    },

    discount: {
      type: Number,
      min: [0, "Product price can't be negative"],
    },

    quantity: {
      type: Number,
      required: true,
      min: [0, "Product quantity can't be negative"],
    },

    brand: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: ObjectId,
        ref: "Brand",
        required: true,
      },
    },

    category: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: ObjectId,
        ref: "Category",
        required: true,
      },
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: ["in-stock", "out-of-stock", "discontinued"],
        message: "status can't be {VALUE}",
      },
      default: "in-stock",
    },

    reviews: [
      {
        type: ObjectId,
        ref: "Reviews",
      },
    ],

    productType: {
      type: String,
      required: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    videoId: {
      type: String,
    },

    additionalInformation: [{}],

    tags: [String],

    sizes: [String],

    offerDate: {
      startDate: {
        type: Date,
      },

      endDate: {
        type: Date,
      },
    },

    featured: {
      type: Boolean,
      default: false,
    },

    sellCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =======================================================
    // INVENTORY MANAGEMENT
    // =======================================================

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    reservedStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    soldQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    lowStockLimit: {
      type: Number,
      default: 5,
      min: 0,
    },

    stockStatus: {
      type: String,
      enum: [
        "in_stock",
        "low_stock",
        "out_of_stock",
      ],
      default: "in_stock",
    },

    stockHistory: [
      {
        action: {
          type: String,
          enum: [
            "added",
            "removed",
            "order",
            "cancel",
            "return",
            "adjustment",
          ],
        },

        quantity: Number,

        previousStock: Number,

        newStock: Number,

        note: String,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// =======================================================
// AUTO STOCK STATUS
// =======================================================

productsSchema.pre("save", function () {

  if (this.stock <= 0) {
    this.stockStatus = "out_of_stock";
    this.status = "out-of-stock";
  } else if (this.stock <= this.lowStockLimit) {
    this.stockStatus = "low_stock";
    this.status = "in-stock";
  } else {
    this.stockStatus = "in_stock";
    this.status = "in-stock";
  }

});

const Products =
  mongoose.models.Products ||
  mongoose.model("Products", productsSchema);

module.exports = Products;