export interface Item {
    id: number;
    sku: string;
    name: string;
    description: string | null;
    quantity: number;
    unit_price: number;
    created_at: string;
    updated_at: string;
};

export interface CreateItemInput {
    sku: string;
    name: string;
    description?: string | null;
    quantity?: number;
    unit_price?: number;
};

export interface UpdateItemInput {
    name?: string;
    description?: string | null;
    quantity?: number;
    unit_price?: number;
};