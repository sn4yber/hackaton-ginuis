import type { Request, Response } from "express";
import {
  getAuthenticatedUser,
  loginUser,
  registerUser,
  updateProfile,
} from "../services/auth.service.js";

export async function register(req: Request, res: Response) {
  const result = await registerUser(req.body);
  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const result = await loginUser(req.body);
  res.json(result);
}

export async function me(req: Request, res: Response) {
  const user = await getAuthenticatedUser(req.auth!.sub);
  res.json({ user });
}

export async function updateMe(req: Request, res: Response) {
  const user = await updateProfile(req.auth!.sub, req.body);
  res.json({ user });
}
