import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBuyerOrders, getBuyerProfile, getProductById, getProducts, placeOrder, upsertBuyerProfile } from "../api/buyer.api";


export function useGetProducts(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  state?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });
}

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["buyerOrders"] }),
  });
}

export function useGetBuyerOrders() {
  return useQuery({
    queryKey: ["buyerOrders"],
    queryFn: () => getBuyerOrders(),
  });
}


export function useGetBuyerProfile() {
  return useQuery({
    queryKey: ["buyerProfile"],
    queryFn: getBuyerProfile,
  });
}

export function useUpsertBuyerProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertBuyerProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["buyerProfile"] }),
  });
}