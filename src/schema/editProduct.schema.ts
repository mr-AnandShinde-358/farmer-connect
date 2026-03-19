// src/schema/product.schema.ts

import { z } from "zod";

export const productEditSchema = z.object({
  name: z.string().min(3, "Name required"),
  category: z.string().min(1, "Category required"),
  price: z.string().min(1, "Price required"),  // ✅ Keep as string
  quantity: z.string().min(1, "Quantity required"),  // ✅ Keep as string
  unit: z.string().min(1, "Unit required"),
  description: z.string().default("").optional(),
  harvestDate: z.string().min(1, "Date required"),
  location: z.object({
    state: z.string().min(1, "State required"),
    district: z.string().min(1, "District required"),
  }),
});

export type ProductEditFormData = z.infer<typeof productEditSchema>;