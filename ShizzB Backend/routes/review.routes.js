const express = require("express");
const router = express.Router();

const {
  addReview,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../controller/review.controller");

// Customer
router.post("/add", addReview);

// Admin
router.get("/all", getAllReviews);
router.patch("/edit/:id", updateReview);
router.delete("/delete/:id", deleteReview);

module.exports = router;