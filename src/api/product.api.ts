// src/api/product.api.ts

import { apiClient } from "./axiosInstance";

export const getProductDetail = async (productId:string) => {
  const res = await apiClient.get(`/products/${productId}`);
  return res.data.data;
};

export const updateProduct = async (productId:string, data:any) => {
  
  const res = await apiClient.patch(`/products/${productId}`, data);
  return res.data.data;
};

export const deleteProduct = async (productId: string) => {

  const res = await apiClient.delete(`/products/${productId}`);
  return res.data;
};