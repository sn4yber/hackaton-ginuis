import { AppError } from "./errors.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function requireNonEmpty(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(`${field} es obligatorio`);
  }

  return value.trim();
}

export function optionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function requireUuid(value: unknown, field = "id"): string {
  const id = requireNonEmpty(value, field);

  if (!UUID_REGEX.test(id)) {
    throw new AppError(`${field} no es válido`);
  }

  return id;
}

export function optionalNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new AppError("El valor numérico no es válido");
  }

  return parsed;
}

export function optionalDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = new Date(String(value));

  if (Number.isNaN(parsed.getTime())) {
    throw new AppError("La fecha no es válida");
  }

  return parsed;
}
