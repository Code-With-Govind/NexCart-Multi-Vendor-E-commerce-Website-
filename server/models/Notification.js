const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["new_seller"],
            required: true,
        },
        message: { type: String, required: true },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
        },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
