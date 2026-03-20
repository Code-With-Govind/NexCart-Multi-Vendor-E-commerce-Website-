const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const regEx = new RegExp(keyword, "i");

    // Step 1: Find all approved sellers
    const Seller = require("../../models/Seller");
    const approvedSellers = await Seller.find({ status: "approved" }).select('_id shopName');

    // Step 2: Get all eligible seller IDs
    const eligibleSellerIds = approvedSellers.map(seller => seller._id);

    const createSearchQuery = {
      $and: [
        {
          $or: [
            { title: regEx },
            { description: regEx },
            { category: regEx },
            { brand: regEx },
          ],
        },
        {
          $or: [
            { sellerId: null },
            { sellerId: { $exists: false } },
            { sellerId: { $in: eligibleSellerIds } }
          ]
        }
      ]
    };

    const searchResults = await Product.find(createSearchQuery).populate('sellerId', 'shopName');

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { searchProducts };
