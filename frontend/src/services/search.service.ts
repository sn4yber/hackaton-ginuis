import { apiFetch } from "@/lib/api";
import type { GlobalSearchResponse } from "@/types/common";

export async function globalSearch(query: string): Promise<GlobalSearchResponse> {
  return apiFetch<GlobalSearchResponse>(
    `/api/search?${new URLSearchParams({ q: query }).toString()}`
  );
}
