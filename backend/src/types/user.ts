export type UserRole = "user" | "admin" | "organization";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  city: string | null;
  interests: string[];
  createdAt: Date;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city: string | null;
  interests: string[];
  createdAt: Date;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  city: string | null;
  interests: string[];
  created_at: Date;
}

export function mapUserRow(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    city: row.city,
    interests: row.interests ?? [],
    createdAt: row.created_at,
  };
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    city: user.city,
    interests: user.interests,
    createdAt: user.createdAt,
  };
}
