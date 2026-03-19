import apiClient from "./axiosInstance";

export const getNotifications = async () => {
  const res = await apiClient.get("/notifications");
  return res.data.data;
};

export const getUnreadCount = async () => {
  const res = await apiClient.get("/notifications/unread-count");
  return res.data.data;
};

export const markAllRead = async () => {
  const res = await apiClient.patch("/notifications/read-all");
  return res.data.data;
};