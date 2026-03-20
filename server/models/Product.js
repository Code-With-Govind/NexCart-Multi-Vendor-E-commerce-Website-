const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      default: null,
    },
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", description: "text", category: "text", brand: "text" });

module.exports = mongoose.model("Product", ProductSchema);
