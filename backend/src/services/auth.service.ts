import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserProfile,
} from "../models/user.model.js";
import { signAccessToken } from "../lib/jwt.js";
import { toPublicUser } from "../types/user.js";
import type { AuthResponse, LoginInput, RegisterInput } from "../types/auth.js";
import { AppError } from "../utils/errors.js";
import { optionalString, requireNonEmpty } from "../utils/validation.js";

const SALT_ROUNDS = 10;

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegisterInput(input: RegisterInput): RegisterInput {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();
  const password = input.password;

  if (!name || name.length < 2) {
    throw new AppError("El nombre debe tener al menos 2 caracteres");
  }

  if (!email || !validateEmail(email)) {
    throw new AppError("El correo no es válido");
  }

  if (!password || password.length < 6) {
    throw new AppError("La contraseña debe tener al menos 6 caracteres");
  }

  return {
    name,
    email,
    password,
    city: input.city?.trim(),
    interests: input.interests?.filter(Boolean),
  };
}

function validateLoginInput(input: LoginInput): LoginInput {
  const email = input.email?.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    throw new AppError("Correo y contraseña son obligatorios");
  }

  return { email, password };
}

function buildAuthResponse(user: Awaited<ReturnType<typeof createUser>>): AuthResponse {
  return {
    user: toPublicUser(user),
    token: signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    }),
  };
}

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  const data = validateRegisterInput(input);
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError("Ya existe una cuenta con ese correo", 409);
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = await createUser({
    name: data.name,
    email: data.email,
    passwordHash,
    city: data.city,
    interests: data.interests,
  });

  return buildAuthResponse(user);
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const data = validateLoginInput(input);
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);

  if (!isValidPassword) {
    throw new AppError("Credenciales inválidas", 401);
  }

  return buildAuthResponse(user);
}

export async function getAuthenticatedUser(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return toPublicUser(user);
}

export async function updateProfile(
  userId: string,
  body: unknown
) {
  const data = body as { name?: string; city?: string; interests?: string[] };
  const name = data.name ? requireNonEmpty(data.name, "El nombre") : undefined;

  const user = await updateUserProfile(userId, {
    name,
    city: data.city !== undefined ? optionalString(data.city) : undefined,
    interests: data.interests?.filter(Boolean),
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return toPublicUser(user);
}
