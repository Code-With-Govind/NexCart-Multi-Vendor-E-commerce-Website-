import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useAdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/notifications", {
                withCredentials: true,
            });
            if (res.data?.success) {
                setNotifications(res.data.data);
                setUnreadCount(res.data.data.length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    }, []);

    const markAllRead = async () => {
        try {
            const res = await axios.put(
                "http://localhost:5000/api/admin/notifications/read-all",
                {},
                { withCredentials: true }
            );
            if (res.data?.success) {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Failed to mark notifications as read", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(intervalId);
    }, [fetchNotifications]);

    return { notifications, unreadCount, markAllRead };
}
