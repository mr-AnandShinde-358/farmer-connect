import apiClient from "./axiosInstance";


export const getProducts = async (params?: {
  page?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  state?: string;
  search?: string;
}) => {
  const res = await apiClient.get("/products", { params });
  return res.data.data;
};

export const getProductById = async (id: string) => {
  const res = await apiClient.get(`/products/${id}`);
  return res.data.data;
};

export const placeOrder = async (data: {
  productId: string;
  quantity: number;
  note?: string;
}) => {
  const res = await apiClient.post("/orders/create", {
    product: data.productId,  // ← yahan rename karo
    quantity: data.quantity,
    note: data.note,
  });
  return res.data.data;
};

export const getBuyerOrders = async (page = 1) => {
  const res = await apiClient.get(`/orders/my?page=${page}`);
  return res.data.data;
};

export const getBuyerProfile = async () => {
  const res = await apiClient.get("/buyer/profile");
  return res.data.data;
};

export const upsertBuyerProfile = async (data: any) => {
 
  const res = await apiClient.post("/buyer/profile", data);
  return res.data.data;
};