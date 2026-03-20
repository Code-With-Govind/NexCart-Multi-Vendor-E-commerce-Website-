const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createSimulatedOrder,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

// Razorpay routes
router.post("/razorpay/create", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);

// Simulated route
router.post("/simulated-create", createSimulatedOrder);

module.exports = router;
