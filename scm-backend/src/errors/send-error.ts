import type { Response } from "express";
import type { AppErrorBody } from "./app-error";

export function sendAppError(res: Response, error: AppErrorBody): void {
    res.status(error.httpStatus).json(error);
}