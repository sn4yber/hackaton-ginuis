import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/auth.js";
import type { UserRole } from "../types/user.js";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET no está definida");
  }

  return secret;
}

export function signAccessToken(payload: {
  userId: string;
  email: string;
  role: UserRole;
}): string {
  return jwt.sign(
    {
      sub: payload.userId,
      email: payload.email,
      role: payload.role,
    },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
}
