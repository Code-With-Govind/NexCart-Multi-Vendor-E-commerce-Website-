const Notification = require("../../models/Notification");

// Get all unread notifications (admin)
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ isRead: false })
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json({ success: true, data: notifications });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error fetching notifications." });
    }
};

// Mark all notifications as read
const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ isRead: false }, { isRead: true });
        res.status(200).json({ success: true, message: "All notifications marked as read." });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error updating notifications." });
    }
};

module.exports = { getNotifications, markAllRead };
