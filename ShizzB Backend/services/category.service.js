const ApiError = require('../errors/api-error');
const Category = require('../model/Category');
const Products = require('../model/Products');

// create category service
exports.createCategoryService = async (data) => {
  const category = await Category.create(data);
  return category;
}

// create all category service
exports.addAllCategoryService = async (data) => {
  await Category.deleteMany()
  const category = await Category.insertMany(data);
  return category;
}

// get all show category service
exports.getShowCategoryServices = async () => {

  const category = await Category.find({

    status: "Show",

    showOnHome: true,

  })
    .populate("products")
    .sort({ displayOrder: 1 });

  return category;

};

// get all category 
exports.getAllCategoryServices = async () => {
  const category = await Category.find({})
    .populate("products");

  return category;
};

// get type of category service
exports.getCategoryTypeService = async (param) => {
  const categories = await Category.find({productType:param}).populate('products');
  return categories;
}

// get type of category service
exports.deleteCategoryService = async (id) => {

  const category = await Category.findById(id)
    .populate("products");

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (category.products && category.products.length > 0) {
    throw new ApiError(
      400,
      `${category.products.length} products are using this category.`
    );
  }

  await Category.findByIdAndDelete(id);

  return {
    success: true,
  };
};

// update category
exports.updateCategoryService = async (id,payload) => {
  const isExist = await Category.findOne({ _id:id })

  if (!isExist) {
    throw new ApiError(404, 'Category not found !')
  }

  const result = await Category.findOneAndUpdate({ _id:id }, payload, {
    new: true,
  })
  return result
}

// get single category
exports.getSingleCategoryService = async (id) => {
  const result = await Category.findById(id);
  return result;
}

// ================================
// Home Categories
// ================================

exports.getHomeCategoriesService = async () => {

  const result = await Category.find({
    showOnHome: true,
  });

  return result;

};