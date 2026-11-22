import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { createAppError, type AppErrorBody } from '../../errors/app-error.js';
import { ProductErrorCode } from '../../errors/error-codes.js';
import {
    createItemSchema,
    itemIdParamSchema,
    listItemsQuerySchema,
    updateItemSchema,
} from './items.schema.js';

export type ValidationOk<T> = { ok: true; data: T };
export type ValidationFail = { ok: false; error: AppErrorBody };
export type ValidationResult<T> = ValidationOk<T> | ValidationFail;

function fromZodError(error: z.ZodError): ValidationFail {
    return {
        ok: false,
        error: createAppError({
            errorCode: 'VALIDATION_FAILED',
            productErrorCode: ProductErrorCode.VALIDATION_FAILED,
            httpStatus: StatusCodes.BAD_REQUEST,
            description: 'Request validation failed',
            action: 'Fix the fields in details and try again.',
            details: error.issues.map((issue) => ({
                field: issue.path.join('.') || 'request',
                message: issue.message,
            })),
        }),
    };
}

export function parseListItemsQuery(query: unknown): ValidationResult<z.infer<typeof listItemsQuerySchema>> {
    const parsed = listItemsQuerySchema.safeParse(query);
    if (!parsed.success) return fromZodError(parsed.error);
    return { ok: true, data: parsed.data };
}

export function parseCreateItemBody(body: unknown): ValidationResult<z.infer<typeof createItemSchema>> {
    const parsed = createItemSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);
    return { ok: true, data: parsed.data };
}

export function parseUpdateItemBody(body: unknown): ValidationResult<z.infer<typeof updateItemSchema>> {
    const parsed = updateItemSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);
    return { ok: true, data: parsed.data };
}

export function parseItemIdParam(id: unknown): ValidationResult<number> {
    const parsed = itemIdParamSchema.safeParse({ id });
    if (!parsed.success) {
        return {
            ok: false,
            error: createAppError({
                errorCode: 'INVALID_ITEM_ID',
                productErrorCode: ProductErrorCode.INVALID_ITEM_ID,
                httpStatus: StatusCodes.BAD_REQUEST,
                description: 'Invalid item id',
                action: 'Use a positive integer, e.g. /items/1',
            }),
        };
    }
    return { ok: true, data: parsed.data.id };
}

export function itemNotFoundError(): AppErrorBody {
    return createAppError({
        errorCode: 'NOT_FOUND',
        productErrorCode: ProductErrorCode.ITEM_NOT_FOUND,
        httpStatus: StatusCodes.NOT_FOUND,
        description: 'Item not found',
        action: 'Check the id or call GET /items.',
    });
}

export function skuDuplicateError(): AppErrorBody {
    return createAppError({
        errorCode: 'CONFLICT',
        productErrorCode: ProductErrorCode.ITEM_SKU_DUPLICATE,
        httpStatus: StatusCodes.CONFLICT,
        description: 'SKU already exists',
        action: 'Choose another sku or update the existing item.',
    });
}