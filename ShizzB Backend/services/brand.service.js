const ApiError = require("../errors/api-error");
const Brand = require("../model/Brand");
const Product = require('../model/Products');

exports.syncAllBrandsService = async () => {

  const brands = await Brand.find();

  for (const brand of brands) {

    const products = await Product.find({
      "brand.id": brand._id
    }).select("_id");

    brand.products = products.map((p) => p._id);

    await brand.save();

  }

  return true;

};

// =======================================================
// ADD BRAND
// =======================================================

exports.addBrandService = async (data) => {
  const brand = await Brand.create(data);
  return brand;
};

// =======================================================
// ADD ALL BRANDS
// =======================================================

exports.addAllBrandService = async (data) => {
  await Brand.deleteMany();

  const brands = await Brand.insertMany(data);

  return brands;
};

// =======================================================
// GET ACTIVE BRANDS
// =======================================================

exports.getBrandsService = async () => {

  const brands = await Brand.find({
    status: "active",
  })
    .populate({
      path: "products",
      match: {
        status: "in-stock",
      },
    })
    .lean();

  // remove null values from populate
  const cleanedBrands = brands.map((brand) => ({
    ...brand,
    products: (brand.products || []).filter(Boolean),
  }));

  return cleanedBrands;
};

// =======================================================
// DELETE BRAND
// =======================================================

exports.deleteBrandsService = async (id) => {

  return await Brand.findByIdAndDelete(id);

};

// =======================================================
// UPDATE BRAND
// =======================================================

exports.updateBrandService = async (id, payload) => {

  const isExist = await Brand.findById(id);

  if (!isExist) {
    throw new ApiError(404, "Brand not found!");
  }

  const result = await Brand.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
    }
  );

  return result;
};

// =======================================================
// GET SINGLE BRAND
// =======================================================

exports.getSingleBrandService = async (id) => {

  return await Brand.findById(id);

};