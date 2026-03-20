const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Seller = require("../../models/Seller");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const Notification = require("../../models/Notification");

// Register as seller (also creates user account)
const registerSeller = async (req, res) => {
    try {
        const {
            userName,
            email,
            password,
            shopName,
            ownerName,
            phone,
            shopDescription,
            businessLicense,
            shopAddress,
        } = req.body;

        if (!userName || !email || !password || !shopName || !ownerName) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered. Please use a different email.",
            });
        }

        const hashPassword = await bcrypt.hash(password, 12);

        // Create user with seller role (pending until approved)
        const newUser = new User({
            userName,
            email,
            password: hashPassword,
            role: "seller",
        });
        await newUser.save();

        // Create seller profile
        const newSeller = new Seller({
            userId: newUser._id,
            shopName,
            ownerName,
            email,
            phone: phone || "",
            shopDescription: shopDescription || "",
            businessLicense: businessLicense || "",
            shopAddress: shopAddress || {},
            status: "pending",
        });
        await newSeller.save();

        // Create admin notification
        const newNotification = new Notification({
            type: "new_seller",
            message: `New seller registration: ${shopName} by ${ownerName}`,
            sellerId: newSeller._id,
            isRead: false,
        });
        await newNotification.save();

        res.status(201).json({
            success: true,
            message:
                "Seller registration submitted! Your account is pending admin approval.",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Registration failed." });
    }
};

// Get seller profile by userId
const getSellerProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const seller = await Seller.findOne({ userId });
        if (!seller)
            return res
                .status(404)
                .json({ success: false, message: "Seller profile not found." });
        res.status(200).json({ success: true, data: seller });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error fetching profile." });
    }
};

// Update seller profile
const updateSellerProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const seller = await Seller.findOneAndUpdate({ userId }, req.body, {
            new: true,
        });
        if (!seller)
            return res
                .status(404)
                .json({ success: false, message: "Seller not found." });
        res.status(200).json({ success: true, data: seller });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Update failed." });
    }
};

// Get seller's own products
const getSellerProducts = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const products = await Product.find({ sellerId });
        res.status(200).json({ success: true, data: products });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error fetching products." });
    }
};

// Add product (seller)
const addSellerProduct = async (req, res) => {
    try {
        const {
            sellerId,
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
        } = req.body;

        const product = new Product({
            sellerId,
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
            averageReview: 0,
        });
        await product.save();
        res.status(201).json({ success: true, data: product });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error adding product." });
    }
};

// Edit seller product
const editSellerProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { sellerId, ...updates } = req.body;

        const product = await Product.findOneAndUpdate(
            { _id: id, sellerId },
            updates,
            { new: true }
        );
        if (!product)
            return res
                .status(404)
                .json({ success: false, message: "Product not found." });
        res.status(200).json({ success: true, data: product });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Update failed." });
    }
};

// Delete seller product
const deleteSellerProduct = async (req, res) => {
    try {
        const { id, sellerId } = req.params;
        const product = await Product.findOneAndDelete({ _id: id, sellerId });
        if (!product)
            return res
                .status(404)
                .json({ success: false, message: "Product not found." });
        res.status(200).json({ success: true, message: "Product deleted." });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Delete failed." });
    }
};

// Get orders containing seller's products
const getSellerOrders = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const sellerProducts = await Product.find({ sellerId }).select("_id");
        const productIds = sellerProducts.map((p) => p._id.toString());

        const allOrders = await Order.find({});
        const sellerOrders = allOrders
            .map((order) => ({
                ...order._doc,
                cartItems: order.cartItems.filter((item) =>
                    productIds.includes(item.productId?.toString())
                ),
            }))
            .filter((order) => order.cartItems.length > 0);

        res.status(200).json({ success: true, data: sellerOrders });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error fetching orders." });
    }
};

// Update order status by seller
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        order.orderStatus = orderStatus;
        await order.save();

        res.status(200).json({
            success: true,
            data: order,
            message: "Order status updated successfully",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error updating order status." });
    }
};

module.exports = {
    registerSeller,
    getSellerProfile,
    updateSellerProfile,
    getSellerProducts,
    addSellerProduct,
    editSellerProduct,
    deleteSellerProduct,
    getSellerOrders,
    updateOrderStatus,
};
