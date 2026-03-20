const express = require("express");
const {
    getAllSellers,
    updateSellerStatus,
} = require("../../controllers/admin/seller-controller");

const router = express.Router();

router.get("/", getAllSellers);
router.put("/:id/status", updateSellerStatus);

module.exports = router;
