const Brand = require("../model/Brand");
const Category = require("../model/Category");
const Product = require("../model/Products");

// ======================================================
// CREATE PRODUCT
// ======================================================

exports.createProductService = async (data) => {

  const product = await Product.create(data);

  const { _id: productId, brand, category } = product;

  await Brand.updateOne(
    { _id: brand.id },
    {
      $push: {
        products: productId,
      },
    }
  );

  await Category.updateOne(
    { _id: category.id },
    {
      $push: {
        products: productId,
      },
    }
  );

  return product;
};

// ======================================================
// ADD ALL PRODUCTS
// ======================================================

exports.addAllProductService = async (data) => {

  await Product.deleteMany();

  const products = await Product.insertMany(data);

  for (const product of products) {

    await Brand.findByIdAndUpdate(product.brand.id, {
      $push: {
        products: product._id,
      },
    });

    await Category.findByIdAndUpdate(product.category.id, {
      $push: {
        products: product._id,
      },
    });

  }

  return products;
};

// ======================================================
// GET ALL PRODUCTS
// ======================================================

exports.getAllProductsService = async () => {

  return await Product.find({})
    .populate("reviews")
    .sort({
      createdAt: -1,
    })
    .lean();

};

// ======================================================
// GET PRODUCTS BY TYPE
// ======================================================

// ======================================================
// GET PRODUCTS BY TYPE
// ======================================================

exports.getProductTypeService = async (req) => {

  const type = req.params.type;
  const query = req.query;

  let products;

  // =========================
  // New Products
  // =========================

  if (query.new === "true") {

    products = await Product.find({
      productType: { $in: [type, "all"] },
    })
      .sort({
        createdAt: -1,
      })
      .limit(8)
      .populate("reviews");

  }

  // =========================
  // Featured Products
  // =========================

  else if (query.featured === "true") {

    products = await Product.find({
      productType: { $in: [type, "all"] },
      featured: true,
    }).populate("reviews");

  }

  // =========================
  // Top Sellers
  // =========================

  else if (query.topSellers === "true") {

    products = await Product.find({
      productType: { $in: [type, "all"] },
    })
      .sort({
        sellCount: -1,
      })
      .limit(8)
      .populate("reviews");

  }

  // =========================
  // All Products
  // =========================

  else {

    products = await Product.find({
      productType: { $in: [type, "all"] },
    }).populate("reviews");

  }

  return products;

};

// ======================================================
// OFFER PRODUCTS
// ======================================================

exports.getOfferTimerProductService = async (type) => {

  return await Product.find({

    productType: type,

    "offerDate.endDate": {
      $gt: new Date(),
    },

  }).populate("reviews");

};

// ======================================================
// POPULAR PRODUCTS
// ======================================================

exports.getPopularProductServiceByType = async (type) => {

  return await Product.find({

    productType: type,

  })
    .sort({
      sellCount: -1,
    })
    .limit(8)
    .populate("reviews");

};

// ======================================================
// TOP RATED PRODUCTS
// ======================================================

exports.getTopRatedProductService = async () => {

  const products = await Product.find({

    reviews: {
      $exists: true,
      $ne: [],
    },

  }).populate("reviews");

  const result = products.map((product) => {

    const totalRating = product.reviews.reduce(

      (sum, review) => sum + review.rating,

      0

    );

    const avgRating = totalRating / product.reviews.length;

    return {

      ...product.toObject(),

      rating: avgRating,

    };

  });

  result.sort((a, b) => b.rating - a.rating);

  return result;

};

// ======================================================
// GET SINGLE PRODUCT
// ======================================================

exports.getProductService = async (id) => {

  const product = await Product.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "userId",
        select: "name email imageURL",
      },
    })
    .lean();

  console.log(product);

  return product;
};

// ======================================================
// RELATED PRODUCTS
// ======================================================

exports.getRelatedProductService = async (productId) => {

  const currentProduct = await Product.findById(productId);

  return await Product.find({

    "category.name": currentProduct.category.name,

    _id: {

      $ne: productId,

    },

  });

};

// ======================================================
// UPDATE PRODUCT
// ======================================================

exports.updateProductService = async (id, currProduct) => {

  const product = await Product.findById(id);

  if (!product) return null;

  product.title = currProduct.title;
  product.brand.name = currProduct.brand.name;
  product.brand.id = currProduct.brand.id;

  product.category.name = currProduct.category.name;
  product.category.id = currProduct.category.id;

  product.sku = currProduct.sku;
  product.img = currProduct.img;
  product.slug = currProduct.slug;
  product.unit = currProduct.unit;

  product.imageURLs = currProduct.imageURLs;
  product.tags = currProduct.tags;

  product.parent = currProduct.parent;
  product.children = currProduct.children;

  product.price = currProduct.price;
  product.discount = currProduct.discount;
  product.stock = Number(currProduct.stock);

product.quantity = Number(currProduct.stock); // Temporary compatibility
product.lowStockLimit = Number(currProduct.lowStockLimit || 5);

  // Auto Status
  if (product.stock <= 0) {

    product.status = "out-of-stock";

    product.stockStatus = "out_of_stock";

}
else if (product.stock <= product.lowStockLimit) {

    product.status = "in-stock";

    product.stockStatus = "low_stock";

}
else {

    product.status = "in-stock";

    product.stockStatus = "in_stock";

}

  product.productType = currProduct.productType;

  product.description = currProduct.description;

  product.additionalInformation = currProduct.additionalInformation;

  product.offerDate.startDate = currProduct.offerDate.startDate;
  product.offerDate.endDate = currProduct.offerDate.endDate;

  product.featured = currProduct.featured;
  product.videoId = currProduct.videoId;

  await product.save();

  return product;
};

// ======================================================
// REDUCE STOCK
// ======================================================

exports.decreaseStock = async (cart) => {

  for (const item of cart) {

    const product = await Product.findById(item._id);

    if (!product) continue;

    const previousStock = product.stock;

    product.stock = Math.max(
      product.stock - item.orderQuantity,
      0
    );

    product.soldQuantity += item.orderQuantity;

    product.sellCount += item.orderQuantity;

    product.stockHistory.push({

      action: "order",

      quantity: item.orderQuantity,

      previousStock,

      newStock: product.stock,

      note: `Order #${item.invoice || ""}`

    });

    await product.save();

  }

};

// ======================================================
// INCREASE STOCK (RETURN / CANCEL)
// ======================================================

exports.increaseStock = async (cart) => {

  for (const item of cart) {

    const product = await Product.findById(item._id);

    if (!product) continue;

    const previousStock = product.stock;

    product.stock += item.orderQuantity;

    product.stockHistory.push({

      action: "return",

      quantity: item.orderQuantity,

      previousStock,

      newStock: product.stock,

      note: "Returned / Cancelled Order"

    });

    await product.save();

  }

};

// ======================================================
// LOW STOCK PRODUCTS
// ======================================================

exports.getLowStockProducts = async () => {

  return await Product.find({

    quantity: {
      $lte: 5,
    },

  }).sort({

    quantity: 1,

  });

};

// ======================================================
// REVIEW PRODUCTS
// ======================================================

exports.getReviewsProducts = async () => {

  const result = await Product.find({

    reviews: {
      $exists: true,
      $ne: [],
    },

  }).populate({

    path: "reviews",

    populate: {

      path: "userId",

      select: "name email imageURL",

    },

  });

  return result.filter((p) => p.reviews.length > 0);

};

// ======================================================
// OUT OF STOCK PRODUCTS
// ======================================================

exports.getStockOutProducts = async () => {

  return await Product.find({

    status: "out-of-stock",

  }).sort({

    createdAt: -1,

  });

};

// ======================================================
// DELETE PRODUCT
// ======================================================

exports.deleteProduct = async (id) => {

  return await Product.findByIdAndDelete(id);

};

// ======================================================
// SYNC ALL BRANDS
// ======================================================

exports.syncAllBrandsService = async () => {

  const brands = await Brand.find();

  for (const brand of brands) {

    const products = await Product.find({
      "brand.id": brand._id
    }).select("_id");

    brand.products = products.map(p => p._id);

    await brand.save();

  }

  return true;

};