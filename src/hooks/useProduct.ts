import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, getMyListings, updateProductStatus } from "../api/farmer.api";

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myListings"] }),
  });
}


export function useGetMyListings() {
  return useQuery({
    queryKey: ["myListings"],
    queryFn: () => getMyListings(),
  });
}

export function useUpdadeProductStatus(){
  const qc = useQueryClient();
  return useMutation({
    mutationFn:updateProductStatus,
    onSuccess:()=>qc.invalidateQueries({queryKey:["myListings"]})
  })
}