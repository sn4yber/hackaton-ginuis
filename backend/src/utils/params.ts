import { AppError } from "./errors.js";

export function getRouteParam(value: string | string[], field = "id"): string {
  const param = Array.isArray(value) ? value[0] : value;

  if (!param) {
    throw new AppError(`${field} es obligatorio`);
  }

  return param;
}
