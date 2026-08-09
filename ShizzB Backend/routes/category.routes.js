const express = require("express");
const router = express.Router();

// Controller
const categoryController = require("../controller/category.controller");

// ==========================
// GET
// ==========================

// Single Category
router.get("/get/:id", categoryController.getSingleCategory);

// All Categories
router.get("/all", categoryController.getAllCategory);

// Show Categories
router.get("/show", categoryController.getShowCategory);

// Product Type Categories
router.get("/show/:type", categoryController.getProductTypeCategory);

// Home Categories (NEW)
router.get("/home", categoryController.getHomeCategories);

// ==========================
// ADD
// ==========================

router.post("/add", categoryController.addCategory);

router.post("/add-all", categoryController.addAllCategory);

// ==========================
// UPDATE
// ==========================

router.patch("/edit/:id", categoryController.updateCategory);

// ==========================
// DELETE
// ==========================

router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;