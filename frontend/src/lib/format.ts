import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return format(parseISO(value), "d MMM yyyy", { locale: es });
  } catch {
    return value;
  }
}
