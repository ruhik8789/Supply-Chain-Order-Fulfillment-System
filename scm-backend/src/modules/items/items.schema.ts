import { z } from 'zod';

export const createItemSchema = z.object({
    sku: z.string().trim().min(1).max(64),
    name: z.string().trim().min(1).max(200),
    description: z.union([z.string().trim().max(2000), z.null()]).optional(),
    quantity: z.number().int().min(0).default(0),
    unit_price: z.number().min(0).default(0),
});

export const updateItemSchema = z.object({
    name: z.string().trim().min(1).max(200).optional(),
    description: z.union([z.string().trim().max(2000), z.null()]).optional(),
    quantity: z.number().int().min(0).optional(),
    unit_price: z.number().min(0).optional(),
})
.refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: `At least one field is required`,
});

export const itemIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export type CreateItemBody = z.infer<typeof createItemSchema>;
export type UpdateItemBody = z.infer<typeof updateItemSchema>;