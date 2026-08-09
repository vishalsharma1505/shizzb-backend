const categoryServices = require("../services/category.service");
const Product = require("../model/Products");

// ============================
// Add Category
// ============================

exports.addCategory = async (req, res, next) => {
  try {

    const result = await categoryServices.createCategoryService(req.body);

    res.status(200).json({
      status: "success",
      message: "Category created successfully!",
      data: result,
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ============================
// Add All Categories
// ============================

exports.addAllCategory = async (req, res, next) => {
  try {

    const result = await categoryServices.addAllCategoryService(req.body);

    res.json({
      message: "Category added successfully",
      result,
    });

  } catch (error) {
    next(error);
  }
};

// ============================
// Show Categories
// ============================

exports.getShowCategory = async (req, res, next) => {
  try {

    const result =
      await categoryServices.getShowCategoryServices();

    res.status(200).json({
      success: true,
      result,
    });

  } catch (error) {
    next(error);
  }
};

// ============================
// All Categories
// ============================

exports.getAllCategory = async (req, res, next) => {
  try {

    const result =
      await categoryServices.getAllCategoryServices();

    res.status(200).json({
      success: true,
      result,
    });

  } catch (error) {
    next(error);
  }
};

// ============================
// Category by Product Type
// ============================

exports.getProductTypeCategory = async (
  req,
  res,
  next
) => {
  try {

    const result =
      await categoryServices.getCategoryTypeService(
        req.params.type
      );

    res.status(200).json({
      success: true,
      result,
    });

  } catch (error) {
    next(error);
  }
};

// ============================
// Single Category
// ============================

exports.getSingleCategory = async (
  req,
  res,
  next
) => {
  try {

    const result =
      await categoryServices.getSingleCategoryService(
        req.params.id
      );

    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
};

// ============================
// Update Category
// ============================

exports.updateCategory = async (
  req,
  res,
  next
) => {
  try {

    const result =
      await categoryServices.updateCategoryService(
        req.params.id,
        req.body
      );

    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      result,
    });

  } catch (error) {
    next(error);
  }
};

// ============================
// Delete Category
// ============================

exports.deleteCategory = async (
  req,
  res,
  next
) => {
  try {

    // Count products using this category
    const productCount = await Product.countDocuments({
      category: req.params.id,
    });

    if (productCount > 0) {

      return res.status(400).json({
        success: false,
        message: `Delete category?\n${productCount} products are using this category.`,
        productCount,
      });

    }

    const result =
      await categoryServices.deleteCategoryService(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      result,
    });

  } catch (error) {
    next(error);
  }
};

// ============================
// Home Categories
// ============================

exports.getHomeCategories = async (req, res, next) => {
  try {

    const result =
      await categoryServices.getHomeCategoriesService();

    res.status(200).json({
      success: true,
      result,
    });

  } catch (error) {
    next(error);
  }
};