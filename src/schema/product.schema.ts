import { z } from 'zod';

export const addProductSchema = z.object({
  name: z.string().min(2, 'Name required'),
  price: z.coerce.number().positive('Valid price do'),
  unit: z.string().min(1, 'Unit required'),
  quantity: z.coerce.number().positive('Valid quantity do'),
  category: z.enum(['GRAIN', 'VEGETABLE', 'FRUIT', 'SPICE', 'DAIRY', 'OTHER']),
  harvestDate: z.date(),
  district: z.string().min(2, 'District required'),
  state: z.string().min(2, 'State required'),
  description: z.string().optional(),
});

export type AddProductForm = z.infer<typeof addProductSchema>;