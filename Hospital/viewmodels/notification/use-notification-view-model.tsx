import { useState, useEffect } from "react";
import NotificationService from "../../services/NotificationService";
import { transformQuillHtml } from "@/utils/function";


export const useNotificationViewModel = () => {
  const [Notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchNotifications = async (params: any | null) => {
    setLoading(true);
    try {
      const response = await NotificationService.getAll(params);
      setNotifications(response.data);
    } catch (err: any) {
      console.log(err);
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };


  const markAsReadNotification = async (notificationid: any) => {
    setLoading(true);
    try {
      const response = await NotificationService.markAsRead(notificationid);
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.notificationid === response?.data?.notificationid
            ? { ...notification, isread: true }
            : notification
        )
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return {
    Notifications,
    loading,
    error,
    refreshNotifications: fetchNotifications,
    markAsReadNotification
  };
};

