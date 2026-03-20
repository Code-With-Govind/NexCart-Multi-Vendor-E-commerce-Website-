const Seller = require("../../models/Seller");
const User = require("../../models/User");

// Get all sellers (with pagination-friendly list)
const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: sellers });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error fetching sellers." });
    }
};

// Approve or reject a seller
const updateSellerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        if (!["approved", "rejected", "pending"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status." });
        }

        const seller = await Seller.findByIdAndUpdate(
            id,
            { status, rejectionReason: rejectionReason || "" },
            { new: true }
        );

        if (!seller)
            return res.status(404).json({ success: false, message: "Seller not found." });

        res.status(200).json({
            success: true,
            message: `Seller ${status} successfully.`,
            data: seller,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Status update failed." });
    }
};

module.exports = { getAllSellers, updateSellerStatus };
