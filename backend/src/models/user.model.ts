import { getPool } from "../lib/db.js";
import { mapUserRow, type User, type UserRow } from "../types/user.js";

const USER_COLUMNS =
  "id, name, email, password_hash, role, city, interests, created_at";

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await getPool().query<UserRow>(
    `SELECT ${USER_COLUMNS} FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );

  return result.rows[0] ? mapUserRow(result.rows[0]) : null;
}

export async function findUserById(id: string): Promise<User | null> {
  const result = await getPool().query<UserRow>(
    `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
    [id]
  );

  return result.rows[0] ? mapUserRow(result.rows[0]) : null;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  role?: string;
  city?: string;
  interests?: string[];
}): Promise<User> {
  const result = await getPool().query<UserRow>(
    `INSERT INTO users (name, email, password_hash, role, city, interests)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${USER_COLUMNS}`,
    [
      input.name.trim(),
      input.email.toLowerCase().trim(),
      input.passwordHash,
      input.role ?? "user",
      input.city?.trim() ?? null,
      input.interests ?? [],
    ]
  );

  return mapUserRow(result.rows[0]);
}

export async function updateUserProfile(
  id: string,
  input: { name?: string; city?: string | null; interests?: string[] }
): Promise<User | null> {
  const result = await getPool().query<UserRow>(
    `UPDATE users
     SET
       name = COALESCE($2, name),
       city = COALESCE($3, city),
       interests = COALESCE($4, interests)
     WHERE id = $1
     RETURNING ${USER_COLUMNS}`,
    [id, input.name ?? null, input.city ?? null, input.interests ?? null]
  );

  return result.rows[0] ? mapUserRow(result.rows[0]) : null;
}
