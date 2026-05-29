import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwt.js";
import type { JwtPayload } from "../types/auth.js";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = header.slice("Bearer ".length);

  try {
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
