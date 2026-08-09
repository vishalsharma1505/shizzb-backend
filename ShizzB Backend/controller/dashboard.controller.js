const Order = require("../model/Order");
const Product = require("../model/Products");
const User = require("../model/User");

exports.getDashboardSummary = async (req,res)=>{
    try{

        const totalOrders = await Order.countDocuments();

        const totalProducts = await Product.countDocuments();

        const totalCustomers = await User.countDocuments({
            role:"user"
        });

        const pendingOrders = await Order.countDocuments({
            status:"pending"
        });

        const confirmedOrders = await Order.countDocuments({
            status:"confirmed"
        });

        const processingOrders = await Order.countDocuments({
            status:"processing"
        });

        const shippedOrders = await Order.countDocuments({
            status:"shipped"
        });

        const outForDeliveryOrders = await Order.countDocuments({
            status:"out for delivery"
        });

        const deliveredOrders = await Order.countDocuments({
            status:"delivered"
        });

        const cancelledOrders = await Order.countDocuments({
            status:"cancelled"
        });

        const returnedOrders = await Order.countDocuments({
            status:"returned"
        });

        const revenue = await Order.aggregate([
            {
                $match:{
                    paymentStatus:"paid"
                }
            },
            {
                $group:{
                    _id:null,
                    totalRevenue:{
                        $sum:"$totalAmount"
                    }
                }
            }
        ]);

        res.json({
            success:true,
            data:{
                totalRevenue:
                    revenue.length>0
                    ? revenue[0].totalRevenue
                    :0,

                totalOrders,
                totalProducts,
                totalCustomers,

                pendingOrders,
                confirmedOrders,
                processingOrders,
                shippedOrders,
                outForDeliveryOrders,
                deliveredOrders,
                cancelledOrders,
                returnedOrders
            }
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:err.message
        });

    }
}

// ======================================================
// MONTHLY SALES GRAPH
// ======================================================

exports.getMonthlySales = async (req, res, next) => {
  try {

   const sales = await Order.aggregate([

  {
    $group: {
      _id: {
        year: {
          $year: "$createdAt",
        },
        month: {
          $month: "$createdAt",
        },
      },

      revenue: {
        $sum: "$totalAmount",
      },

      orders: {
        $sum: 1,
      },
    },
  },

  {
    $sort: {
      "_id.year": 1,
      "_id.month": 1,
    },
  },

]);

    res.status(200).json({
      success: true,
      data: sales,
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};


// ======================================================
// RECENT ORDERS
// ======================================================

exports.getRecentOrders = async (req, res, next) => {
  try {

    const recentOrders = await Order.find({})
      .populate("user")
      .sort({
        createdAt: -1,
      })
      .limit(5); // Only Latest 5 Orders

    res.status(200).json({
      success: true,
      data: recentOrders,
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ======================================================
// LATEST CUSTOMERS
// ======================================================

exports.getLatestCustomers = async (req, res, next) => {

  try {

    const customers = await Order.find({})
      .populate("user")
      .sort({
        createdAt: -1,
      });

    const uniqueCustomers = [];

    const ids = new Set();

    customers.forEach((item) => {

      if (
        item.user &&
        !ids.has(item.user._id.toString())
      ) {

        ids.add(item.user._id.toString());

        uniqueCustomers.push(item.user);

      }

    });

    res.status(200).json({

      success: true,

      data: uniqueCustomers.slice(0, 5), // Only Latest 5 Customers

    });

  } catch (error) {

    console.log(error);

    next(error);

  }

};

// ======================================================
// DASHBOARD COUNTS
// ======================================================

exports.getDashboardCounts = async (req, res, next) => {

  try {

    const today = new Date();

    today.setHours(0,0,0,0);

    const todayOrders = await Order.countDocuments({
      createdAt: {
        $gte: today,
      },
    });

    const todayRevenue = await Order.aggregate([

      {
        $match: {

          paymentStatus: "paid",

          createdAt: {
            $gte: today,
          },

        },
      },

      {
        $group: {

          _id: null,

          revenue: {
            $sum: "$totalAmount",
          },

        },
      },

    ]);

    res.status(200).json({

      success: true,

      data: {

        todayOrders,

        todayRevenue:
          todayRevenue.length > 0
            ? todayRevenue[0].revenue
            : 0,

      },

    });

  } catch (error) {

    console.log(error);

    next(error);

  }

};
// ======================================================
// BEST SELLING PRODUCTS
// ======================================================

exports.getBestSellingProducts = async (req, res, next) => {
  try {

    const products = await Product.find({})
      .sort({
        sellCount: -1,
      })
      .limit(5); // <-- Sirf Top 5

    res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ======================================================
// LOW STOCK PRODUCTS
// ======================================================

exports.getLowStockProducts = async (req, res, next) => {
  try {

    const products = await Product.find({
      stockStatus: "low_stock"
    })
      .sort({
        stock: 1
      })
      .limit(20);

    res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};


// ======================================================
// OUT OF STOCK PRODUCTS
// ======================================================

exports.getOutOfStockProducts = async (req, res, next) => {
  try {

    const products = await Product.find({
      stockStatus: "out_of_stock"
    })
      .sort({
        updatedAt: -1
      });

    res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ======================================================
// LATEST PRODUCTS
// ======================================================

exports.getLatestProducts = async (req, res, next) => {

  try {

    const products = await Product.find({})
      .sort({

        createdAt: -1,

      })
      .limit(5);

    res.status(200).json({

      success: true,

      data: products,

    });

  } catch (error) {

    console.log(error);

    next(error);

  }

};