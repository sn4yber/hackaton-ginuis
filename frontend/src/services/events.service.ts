import { apiFetch } from "@/lib/api";
import type { CreateEventInput, EventWithOrganization } from "@/types/event";

function buildQuery(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchEvents(filters?: {
  organizationId?: string;
  search?: string;
  upcoming?: string;
}): Promise<EventWithOrganization[]> {
  const data = await apiFetch<{ events: EventWithOrganization[] }>(
    `/api/events${buildQuery(filters ?? {})}`
  );
  return data.events;
}

export async function fetchEvent(id: string): Promise<EventWithOrganization> {
  const data = await apiFetch<{ event: EventWithOrganization }>(`/api/events/${id}`);
  return data.event;
}

export async function createEvent(
  token: string,
  input: CreateEventInput
): Promise<EventWithOrganization> {
  const data = await apiFetch<{ event: EventWithOrganization }>("/api/events", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
  return data.event;
}

export async function updateEvent(
  token: string,
  id: string,
  input: Partial<CreateEventInput>
): Promise<EventWithOrganization> {
  const data = await apiFetch<{ event: EventWithOrganization }>(`/api/events/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
  return data.event;
}

export async function deleteEvent(token: string, id: string): Promise<void> {
  await apiFetch(`/api/events/${id}`, { method: "DELETE", token });
}
