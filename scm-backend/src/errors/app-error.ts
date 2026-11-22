import type { StatusCodes } from "http-status-codes";
import type { ProductErrorCode } from "./error-codes";

export type AppErrorDetail = {
    field: string;
    message: string;
};

export type AppErrorBody = {
    errorCode: string;
    productErrorCode: ProductErrorCode;
    httpStatus: StatusCodes;
    description: string;
    action?: string;
    details?: AppErrorDetail[];
}

export function createAppError(body: AppErrorBody): AppErrorBody {
    return body;
}