import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../types/user.js";
import { AppError } from "../utils/errors.js";

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.auth?.role as UserRole | undefined;

    if (!role || !roles.includes(role)) {
      return next(new AppError("No tienes permisos para esta acción", 403));
    }

    next();
  };
}
