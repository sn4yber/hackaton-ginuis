import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";

export function notFoundMiddleware(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError("Ruta no encontrada", 404));
}
