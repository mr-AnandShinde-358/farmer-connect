import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, getUnreadCount, markAllRead } from "../api/notification.api";

export function useGetNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
}

export function useGetUnreadCount() {
  return useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });
}