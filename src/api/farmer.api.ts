import apiClient from "./axiosInstance";


export const getFarmerProfile = async () => {
    //caling fetching farmer profile
  const res = await apiClient.get("/farmer/profile");
  return res.data.data;
};

export const upsertFarmerProfile = async (data: any) => {
    //create profile
    
  const res = await apiClient.post("/farmer/profile", data);

  return res.data.data;
};


// create product
export const createProduct = async (formData: FormData) => {


  const res = await apiClient.post("/products/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};


export const getMyListings = async (page = 1) => {
  const res = await apiClient.get(`/products/my/listings?page=${page}`);
  return res.data.data;
};


export const getMyOrders = async (page = 1) => {
  const res = await apiClient.get(`/orders/my?page=${page}`);
  return res.data.data;
};

export const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
}) => {
  const res = await apiClient.patch(`/orders/${orderId}/status`, { status });
  return res.data.data;
};

export const getFarmerDashboard = async () => {
  const res = await apiClient.get("/farmer/dashboard");
  return res.data.data;
};


export const updateProductStatus = async({productId,status}:{
  productId:string,
  status: "ACTIVE"|"SOLD_OUT"|"INACTIVE"
})=>{
  const res = await apiClient.patch(`/products/${productId}/status`,{
    status
  })

  return res.data.data

}