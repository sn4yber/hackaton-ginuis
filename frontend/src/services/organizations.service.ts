import { apiFetch } from "@/lib/api";
import type {
  CreateOrganizationInput,
  Organization,
  OrganizationDetail,
} from "@/types/organization";

function buildQuery(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchOrganizations(filters?: {
  search?: string;
  category?: string;
}): Promise<Organization[]> {
  const data = await apiFetch<{ organizations: Organization[] }>(
    `/api/organizations${buildQuery(filters ?? {})}`
  );
  return data.organizations;
}

export async function fetchOrganization(id: string): Promise<OrganizationDetail> {
  const data = await apiFetch<{ organization: OrganizationDetail }>(
    `/api/organizations/${id}`
  );
  return data.organization;
}

export async function createOrganization(
  token: string,
  input: CreateOrganizationInput
): Promise<Organization> {
  const data = await apiFetch<{ organization: Organization }>("/api/organizations", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
  return data.organization;
}

export async function updateOrganization(
  token: string,
  id: string,
  input: Partial<CreateOrganizationInput>
): Promise<Organization> {
  const data = await apiFetch<{ organization: Organization }>(`/api/organizations/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
  return data.organization;
}

export async function deleteOrganization(token: string, id: string): Promise<void> {
  await apiFetch(`/api/organizations/${id}`, { method: "DELETE", token });
}
