import { apiFetch } from "@/lib/api";
import type { AuthResponse, LoginInput, PublicUser, RegisterInput } from "@/types/auth";

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchCurrentUser(token: string): Promise<PublicUser> {
  const data = await apiFetch<{ user: PublicUser }>("/api/auth/me", { token });
  return data.user;
}

export async function updateProfile(
  token: string,
  input: { name?: string; city?: string | null; interests?: string[] }
): Promise<PublicUser> {
  const data = await apiFetch<{ user: PublicUser }>("/api/auth/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(input),
  });
  return data.user;
}
