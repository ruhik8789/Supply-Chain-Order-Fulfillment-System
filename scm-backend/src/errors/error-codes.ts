export const ProductErrorCode = {
    VALIDATION_FAILED: 'COMMON-400-001',
    INVALID_ITEM_ID: 'COMMON-400-001',
    ITEM_NOT_FOUND: 'ITEM-404-001',
    ITEM_SKU_DUPLICATE: 'ITEM-409-001',
    INTERNAL_SERVER_ERROR: 'COMMON-500-001',
} as const;

export type ProductErrorCode = (typeof ProductErrorCode)[keyof typeof ProductErrorCode];