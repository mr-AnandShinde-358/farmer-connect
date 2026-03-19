import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyOrders, updateOrderStatus } from "../api/farmer.api";

export function useGetMyOrders() {
  return useQuery({
    queryKey: ["farmerOrders"],
    queryFn: () => getMyOrders(),
  });
}

export function useUpdateOrderStatusAsBuyer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["buyerOrders"] }),
  });
}

// Farmer को order update करने के लिए
export function useUpdateOrderStatusAsFarmer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => qc.invalidateQueries({ 
      queryKey: ["farmerOrders"]  // ✅ Farmer query only
    }),
  });
}