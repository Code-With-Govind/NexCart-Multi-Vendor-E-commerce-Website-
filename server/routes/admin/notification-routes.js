const express = require("express");
const {
    getNotifications,
    markAllRead,
} = require("../../controllers/admin/notification-controller");

const router = express.Router();

router.get("/", getNotifications);
router.put("/read-all", markAllRead);

module.exports = router;
