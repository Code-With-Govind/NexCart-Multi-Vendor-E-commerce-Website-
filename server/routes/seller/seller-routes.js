const express = require("express");
const {
    registerSeller,
    getSellerProfile,
    updateSellerProfile,
    getSellerProducts,
    addSellerProduct,
    editSellerProduct,
    deleteSellerProduct,
    getSellerOrders,
    updateOrderStatus,
} = require("../../controllers/seller/seller-controller");

const { upload } = require("../../helpers/cloudinary");
const { imageUploadUtil } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/register", registerSeller);
router.get("/profile/:userId", getSellerProfile);
router.put("/profile/:userId", updateSellerProfile);

// Product routes
router.get("/products/:sellerId", getSellerProducts);
router.post("/products", addSellerProduct);
router.put("/products/:id", editSellerProduct);
router.delete("/products/:id/:sellerId", deleteSellerProduct);

// Image upload (reuse cloudinary helper)
router.post("/upload-image", upload.single("my_file"), async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtil(url);
        res.json({ success: true, result });
    } catch (error) {
        res.json({ success: false, message: "Image upload error" });
    }
});

// Orders
router.get("/orders/:sellerId", getSellerOrders);
router.put("/orders/:orderId/status", updateOrderStatus);

module.exports = router;
