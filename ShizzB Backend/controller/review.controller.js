const mongoose = require("mongoose");

const Order = require("../model/Order");
const Products = require("../model/Products");
const Review = require("../model/Review");

// =======================================================
// ADD REVIEW
// =======================================================

exports.addReview = async (req, res, next) => {

  try {

    const {
      userId,
      productId,
      rating,
      comment,
    } = req.body;

    if (!userId || !productId || !rating) {

      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });

    }

    const existingReview = await Review.findOne({
      userId,
      productId,
    });

    if (existingReview) {

      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });

    }

    const purchased = await Order.findOne({

      user: new mongoose.Types.ObjectId(userId),

      "cart._id": {
        $in: [productId],
      },

    });

    if (!purchased) {

      return res.status(400).json({
        success: false,
        message: "Without purchase you cannot review this product.",
      });

    }

    const review = await Review.create({

      userId,
      productId,
      rating,
      comment,

    });

    await Products.findByIdAndUpdate(

      productId,

      {
        $push: {
          reviews: review._id,
        },
      }

    );

    return res.status(201).json({

      success: true,
      review,

    });

  }

  catch (err) {

    console.log(err);

    next(err);

  }

};

// =======================================================
// GET ALL REVIEWS
// =======================================================

exports.getAllReviews = async (req, res, next) => {

  try {

    const reviews = await Review.find()

      .populate("userId", "name email")

      .populate("productId", "title img")

      .sort({ createdAt: -1 });

    res.json({

      success: true,

      result: reviews,

    });

  }

  catch (err) {

    console.log(err);

    next(err);

  }

};

// =======================================================
// UPDATE REVIEW
// =======================================================

exports.updateReview = async (req, res, next) => {

  try {

    const review = await Review.findByIdAndUpdate(

      req.params.id,

      req.body,

      {
        new: true,
      }

    );

    res.json({

      success: true,

      result: review,

    });

  }

  catch (err) {

    console.log(err);

    next(err);

  }

};

// =======================================================
// DELETE REVIEW
// =======================================================

exports.deleteReview = async (req, res, next) => {

  try {

    const review = await Review.findById(req.params.id);

    if (!review) {

      return res.status(404).json({

        success: false,

        message: "Review not found",

      });

    }

    await Products.findByIdAndUpdate(

      review.productId,

      {

        $pull: {

          reviews: review._id,

        },

      }

    );

    await Review.findByIdAndDelete(req.params.id);

    res.json({

      success: true,

      message: "Review deleted successfully",

    });

  }

  catch (err) {

    console.log(err);

    next(err);

  }

};