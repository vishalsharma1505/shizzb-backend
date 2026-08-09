const express = require('express');
const router = express.Router();
const {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} = require('../controller/coupon.controller');

// add
router.post("/add", addCoupon);

// add multiple
router.post("/all", addAllCoupon);

// get all
router.get("/all", getAllCoupons);

router.get("/", getAllCoupons);

// get single
router.get("/:id", getCouponById);

// update
router.patch("/edit/:id", updateCoupon);

// delete
router.delete("/delete/:id", deleteCoupon);

module.exports = router;
