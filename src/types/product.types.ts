// src/types/product.types.ts

export interface IProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  description?: string;
  harvestDate: string;
  images: Array<{
    url: string;
    publicId?: string;
  }>;
  location: {
    state: string;
    district: string;
  };
  farmer: {
    _id: string;
    fullName: string;
  };
  status: "ACTIVE" | "SOLD_OUT" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface IProductUpdatePayload {
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  description?: string;
  harvestDate: string;
  location: {
    state: string;
    district: string;
  };
}