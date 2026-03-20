const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        shopName: { type: String, required: true },
        ownerName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, default: "" },
        shopDescription: { type: String, default: "" },
        businessLicense: { type: String, default: "" },
        shopAddress: {
            address: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            pincode: { type: String, default: "" },
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        rejectionReason: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Seller", SellerSchema);
