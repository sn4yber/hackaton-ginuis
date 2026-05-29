import { apiFetch } from "@/lib/api";
import type { CreateOpportunityInput, OpportunityWithOrganization } from "@/types/opportunity";

function buildQuery(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchOpportunities(filters?: {
  category?: string;
  organizationId?: string;
  search?: string;
}): Promise<OpportunityWithOrganization[]> {
  const data = await apiFetch<{ opportunities: OpportunityWithOrganization[] }>(
    `/api/opportunities${buildQuery(filters ?? {})}`
  );
  return data.opportunities;
}

export async function fetchOpportunity(id: string): Promise<OpportunityWithOrganization> {
  const data = await apiFetch<{ opportunity: OpportunityWithOrganization }>(
    `/api/opportunities/${id}`
  );
  return data.opportunity;
}

export async function createOpportunity(
  token: string,
  input: CreateOpportunityInput
): Promise<OpportunityWithOrganization> {
  const data = await apiFetch<{ opportunity: OpportunityWithOrganization }>(
    "/api/opportunities",
    { method: "POST", token, body: JSON.stringify(input) }
  );
  return data.opportunity;
}

export async function updateOpportunity(
  token: string,
  id: string,
  input: Partial<CreateOpportunityInput>
): Promise<OpportunityWithOrganization> {
  const data = await apiFetch<{ opportunity: OpportunityWithOrganization }>(
    `/api/opportunities/${id}`,
    { method: "PUT", token, body: JSON.stringify(input) }
  );
  return data.opportunity;
}

export async function deleteOpportunity(token: string, id: string): Promise<void> {
  await apiFetch(`/api/opportunities/${id}`, { method: "DELETE", token });
}
