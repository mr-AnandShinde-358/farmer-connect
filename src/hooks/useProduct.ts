import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, getMyListings, updateProductStatus } from "../api/farmer.api";
import { deleteProduct, getProductDetail, updateProduct } from "../api/product.api";


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

// // Get product detail
export function useGetProductDetail(productId:string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductDetail(productId),
    enabled: !!productId,
  });
}

// Update product
export function useUpdateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }:{
      productId:string,
      data:any
    }) => updateProduct(productId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
}


export function useDeleteProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
}