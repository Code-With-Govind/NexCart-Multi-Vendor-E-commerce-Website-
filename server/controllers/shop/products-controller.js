const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const {
      category = [],
      brand = [],
      sortBy = "price-lowtohigh",
      page = 1,
      limit = 10
    } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;

        break;
      case "price-hightolow":
        sort.price = -1;

        break;
      case "title-atoz":
        sort.title = 1;

        break;

      case "title-ztoa":
        sort.title = -1;

        break;

      default:
        sort.price = 1;
        break;
    }

    // Step 1: Find all approved sellers
    const Seller = require("../../models/Seller");
    const approvedSellers = await Seller.find({ status: "approved" }).select('_id shopName');

    // Step 2: Get all eligible seller IDs
    const eligibleSellerIds = approvedSellers.map(seller => seller._id);

    // Step 3: Add the eligible sellers to the product filter
    // Products are visible if they have no sellerId (Admin added) OR if they belong to an eligible seller
    filters.$or = [
      { sellerId: null },
      { sellerId: { $exists: false } },
      { sellerId: { $in: eligibleSellerIds } }
    ];

    const totalProducts = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .populate('sellerId', 'shopName')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: products,
      totalPage: Math.ceil(totalProducts / limit),
      totalProducts
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
