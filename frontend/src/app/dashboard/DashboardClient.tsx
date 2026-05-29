"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { PageShell } from "@/components/shared/PageShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { getAuthErrorMessage, useAuth } from "@/hooks/useAuth";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/services/categories.service";
import { createEvent, deleteEvent, fetchEvents, updateEvent } from "@/services/events.service";
import {
  createOpportunity,
  deleteOpportunity,
  fetchOpportunities,
  updateOpportunity,
} from "@/services/opportunities.service";
import {
  createOrganization,
  deleteOrganization,
  fetchOrganizations,
  updateOrganization,
} from "@/services/organizations.service";
import type { Category } from "@/types/category";
import type { EventWithOrganization } from "@/types/event";
import type { OpportunityWithOrganization } from "@/types/opportunity";
import type { Organization } from "@/types/organization";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border-2 border-sand bg-cream p-6">
      <h2 className="text-lg font-bold text-wood-950">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function DashboardClient() {
  const router = useRouter();
  const { user, token, isLoading, updateProfile, logout } = useAuth();

  const [profileName, setProfileName] = useState("");
  const [profileCity, setProfileCity] = useState("");
  const [profileInterests, setProfileInterests] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityWithOrganization[]>([]);
  const [events, setEvents] = useState<EventWithOrganization[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [orgForm, setOrgForm] = useState({
    id: "",
    name: "",
    description: "",
    location: "",
    category: "",
    email: "",
    website: "",
  });

  const [oppForm, setOppForm] = useState({
    id: "",
    title: "",
    description: "",
    category: "",
    organizationId: "",
    location: "",
    link: "",
  });

  const [eventForm, setEventForm] = useState({
    id: "",
    title: "",
    description: "",
    organizationId: "",
    location: "",
    date: "",
  });

  const [categoryForm, setCategoryForm] = useState({ id: "", name: "", icon: "" });

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    setProfileName(user.name);
    setProfileCity(user.city ?? "");
    setProfileInterests(user.interests.join(", "));
  }, [user]);

  useEffect(() => {
    if (!token) return;

    Promise.all([
      fetchOrganizations(),
      fetchOpportunities(),
      fetchEvents({ upcoming: "false" }),
      fetchCategories(),
    ])
      .then(([orgs, opps, evts, cats]) => {
        setOrganizations(orgs);
        setOpportunities(opps);
        setEvents(evts);
        setCategories(cats);
      })
      .catch((error) => setActionError(getAuthErrorMessage(error)))
      .finally(() => setDataLoading(false));
  }, [token]);

  async function handleProfileSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;
    setProfileLoading(true);
    setProfileMessage(null);
    try {
      await updateProfile({
        name: profileName,
        city: profileCity || null,
        interests: profileInterests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setProfileMessage("Perfil actualizado.");
    } catch (error) {
      setProfileMessage(getAuthErrorMessage(error));
    } finally {
      setProfileLoading(false);
    }
  }

  async function runAction(action: () => Promise<void>, success: string) {
    setActionError(null);
    setActionSuccess(null);
    try {
      await action();
      setActionSuccess(success);
    } catch (error) {
      setActionError(getAuthErrorMessage(error));
    }
  }

  async function refreshData() {
    if (!token) return;
    const [orgs, opps, evts, cats] = await Promise.all([
      fetchOrganizations(),
      fetchOpportunities(),
      fetchEvents({ upcoming: "false" }),
      fetchCategories(),
    ]);
    setOrganizations(orgs);
    setOpportunities(opps);
    setEvents(evts);
    setCategories(cats);
  }

  if (isLoading || !user || !token) {
    return (
      <PageShell title="Panel">
        <p className="text-muted">Cargando...</p>
      </PageShell>
    );
  }

  return (
    <PageShell title="Panel" subtitle={`Hola, ${user.name}. Gestiona contenido y tu perfil.`}>
      {actionError && (
        <p className="mb-4 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta" role="alert">
          {actionError}
        </p>
      )}
      {actionSuccess && (
        <p className="mb-4 rounded-lg bg-teal/10 px-4 py-3 text-sm text-teal" role="status">
          {actionSuccess}
        </p>
      )}

      <div className="space-y-8">
        <Section title="Mi perfil">
          <form onSubmit={handleProfileSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="profile-name">Nombre</Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="profile-city">Ciudad</Label>
              <Input
                id="profile-city"
                value={profileCity}
                onChange={(e) => setProfileCity(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="profile-interests">Intereses (separados por coma)</Label>
              <Input
                id="profile-interests"
                value={profileInterests}
                onChange={(e) => setProfileInterests(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <Button type="submit" isLoading={profileLoading}>
                Guardar perfil
              </Button>
              <Button type="button" variant="secondary" onClick={logout}>
                Cerrar sesion
              </Button>
            </div>
          </form>
          {profileMessage && <p className="text-sm text-muted">{profileMessage}</p>}
        </Section>

        <Section title="Organizaciones">
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await runAction(async () => {
                if (orgForm.id) {
                  await updateOrganization(token, orgForm.id, {
                    name: orgForm.name,
                    description: orgForm.description,
                    location: orgForm.location || null,
                    category: orgForm.category || null,
                    email: orgForm.email || null,
                    website: orgForm.website || null,
                  });
                } else {
                  await createOrganization(token, {
                    name: orgForm.name,
                    description: orgForm.description,
                    location: orgForm.location || null,
                    category: orgForm.category || null,
                    email: orgForm.email || null,
                    website: orgForm.website || null,
                  });
                }
                setOrgForm({
                  id: "",
                  name: "",
                  description: "",
                  location: "",
                  category: "",
                  email: "",
                  website: "",
                });
                await refreshData();
              }, orgForm.id ? "Organizacion actualizada." : "Organizacion creada.");
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <Label htmlFor="org-name">Nombre</Label>
              <Input
                id="org-name"
                value={orgForm.name}
                onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="org-desc">Descripcion</Label>
              <Textarea
                id="org-desc"
                value={orgForm.description}
                onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="org-location">Ubicacion</Label>
              <Input
                id="org-location"
                value={orgForm.location}
                onChange={(e) => setOrgForm({ ...orgForm, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="org-category">Categoria</Label>
              <Input
                id="org-category"
                value={orgForm.category}
                onChange={(e) => setOrgForm({ ...orgForm, category: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="org-email">Email</Label>
              <Input
                id="org-email"
                type="email"
                value={orgForm.email}
                onChange={(e) => setOrgForm({ ...orgForm, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="org-website">Sitio web</Label>
              <Input
                id="org-website"
                value={orgForm.website}
                onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">{orgForm.id ? "Actualizar" : "Crear"} organizacion</Button>
            </div>
          </form>

          {dataLoading ? (
            <p className="text-sm text-muted">Cargando...</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {organizations.map((org) => (
                <li
                  key={org.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-sand px-3 py-2"
                >
                  <Link href={`/organizations/${org.id}`} className="font-medium text-teal hover:underline">
                    {org.name}
                  </Link>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-wood-800 hover:text-teal"
                      onClick={() =>
                        setOrgForm({
                          id: org.id,
                          name: org.name,
                          description: org.description,
                          location: org.location ?? "",
                          category: org.category ?? "",
                          email: org.email ?? "",
                          website: org.website ?? "",
                        })
                      }
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="text-terracotta hover:underline"
                      onClick={() => {
                        if (!window.confirm("Eliminar esta organizacion?")) return;
                        runAction(async () => {
                          await deleteOrganization(token, org.id);
                          await refreshData();
                        }, "Organizacion eliminada.");
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Oportunidades">
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await runAction(async () => {
                if (oppForm.id) {
                  await updateOpportunity(token, oppForm.id, {
                    title: oppForm.title,
                    description: oppForm.description,
                    category: oppForm.category,
                    organizationId: oppForm.organizationId,
                    location: oppForm.location || null,
                    link: oppForm.link || null,
                  });
                } else {
                  await createOpportunity(token, {
                    title: oppForm.title,
                    description: oppForm.description,
                    category: oppForm.category,
                    organizationId: oppForm.organizationId,
                    location: oppForm.location || null,
                    link: oppForm.link || null,
                  });
                }
                setOppForm({
                  id: "",
                  title: "",
                  description: "",
                  category: "",
                  organizationId: "",
                  location: "",
                  link: "",
                });
                await refreshData();
              }, oppForm.id ? "Oportunidad actualizada." : "Oportunidad creada.");
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <Label htmlFor="opp-title">Titulo</Label>
              <Input
                id="opp-title"
                value={oppForm.title}
                onChange={(e) => setOppForm({ ...oppForm, title: e.target.value })}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="opp-desc">Descripcion</Label>
              <Textarea
                id="opp-desc"
                value={oppForm.description}
                onChange={(e) => setOppForm({ ...oppForm, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="opp-category">Categoria</Label>
              <Input
                id="opp-category"
                value={oppForm.category}
                onChange={(e) => setOppForm({ ...oppForm, category: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="opp-org">Organizacion</Label>
              <select
                id="opp-org"
                value={oppForm.organizationId}
                onChange={(e) => setOppForm({ ...oppForm, organizationId: e.target.value })}
                required
                className="h-11 w-full rounded-lg border-2 border-sand bg-cream px-3 text-sm"
              >
                <option value="">Seleccionar...</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="opp-location">Ubicacion</Label>
              <Input
                id="opp-location"
                value={oppForm.location}
                onChange={(e) => setOppForm({ ...oppForm, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="opp-link">Enlace</Label>
              <Input
                id="opp-link"
                value={oppForm.link}
                onChange={(e) => setOppForm({ ...oppForm, link: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">{oppForm.id ? "Actualizar" : "Crear"} oportunidad</Button>
            </div>
          </form>

          <ul className="space-y-2 text-sm">
            {opportunities.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-sand px-3 py-2"
              >
                <Link href={`/opportunities/${item.id}`} className="font-medium text-teal hover:underline">
                  {item.title}
                </Link>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-wood-800 hover:text-teal"
                    onClick={() =>
                      setOppForm({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        category: item.category,
                        organizationId: item.organizationId,
                        location: item.location ?? "",
                        link: item.link ?? "",
                      })
                    }
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="text-terracotta hover:underline"
                    onClick={() => {
                      if (!window.confirm("Eliminar esta oportunidad?")) return;
                      runAction(async () => {
                        await deleteOpportunity(token, item.id);
                        await refreshData();
                      }, "Oportunidad eliminada.");
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Eventos">
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await runAction(async () => {
                if (eventForm.id) {
                  await updateEvent(token, eventForm.id, {
                    title: eventForm.title,
                    description: eventForm.description,
                    organizationId: eventForm.organizationId,
                    location: eventForm.location || null,
                    date: eventForm.date || null,
                  });
                } else {
                  await createEvent(token, {
                    title: eventForm.title,
                    description: eventForm.description,
                    organizationId: eventForm.organizationId,
                    location: eventForm.location || null,
                    date: eventForm.date || null,
                  });
                }
                setEventForm({
                  id: "",
                  title: "",
                  description: "",
                  organizationId: "",
                  location: "",
                  date: "",
                });
                await refreshData();
              }, eventForm.id ? "Evento actualizado." : "Evento creado.");
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <Label htmlFor="event-title">Titulo</Label>
              <Input
                id="event-title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="event-desc">Descripcion</Label>
              <Textarea
                id="event-desc"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="event-org">Organizacion</Label>
              <select
                id="event-org"
                value={eventForm.organizationId}
                onChange={(e) => setEventForm({ ...eventForm, organizationId: e.target.value })}
                required
                className="h-11 w-full rounded-lg border-2 border-sand bg-cream px-3 text-sm"
              >
                <option value="">Seleccionar...</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="event-date">Fecha</Label>
              <Input
                id="event-date"
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="event-location">Ubicacion</Label>
              <Input
                id="event-location"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">{eventForm.id ? "Actualizar" : "Crear"} evento</Button>
            </div>
          </form>

          <ul className="space-y-2 text-sm">
            {events.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-sand px-3 py-2"
              >
                <Link href={`/events/${item.id}`} className="font-medium text-teal hover:underline">
                  {item.title}
                </Link>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-wood-800 hover:text-teal"
                    onClick={() =>
                      setEventForm({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        organizationId: item.organizationId,
                        location: item.location ?? "",
                        date: item.date ? item.date.slice(0, 10) : "",
                      })
                    }
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="text-terracotta hover:underline"
                    onClick={() => {
                      if (!window.confirm("Eliminar este evento?")) return;
                      runAction(async () => {
                        await deleteEvent(token, item.id);
                        await refreshData();
                      }, "Evento eliminado.");
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {user.role === "admin" && (
          <Section title="Categorias (admin)">
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                await runAction(async () => {
                  if (categoryForm.id) {
                    await updateCategory(token, categoryForm.id, {
                      name: categoryForm.name,
                      icon: categoryForm.icon || null,
                    });
                  } else {
                    await createCategory(token, {
                      name: categoryForm.name,
                      icon: categoryForm.icon || null,
                    });
                  }
                  setCategoryForm({ id: "", name: "", icon: "" });
                  await refreshData();
                }, categoryForm.id ? "Categoria actualizada." : "Categoria creada.");
              }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div>
                <Label htmlFor="cat-name">Nombre</Label>
                <Input
                  id="cat-name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cat-icon">Icono</Label>
                <Input
                  id="cat-icon"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">{categoryForm.id ? "Actualizar" : "Crear"} categoria</Button>
              </div>
            </form>

            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-sand px-3 py-2"
                >
                  <span>
                    {cat.name}
                    {cat.icon ? ` (${cat.icon})` : ""}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-wood-800 hover:text-teal"
                      onClick={() =>
                        setCategoryForm({
                          id: cat.id,
                          name: cat.name,
                          icon: cat.icon ?? "",
                        })
                      }
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="text-terracotta hover:underline"
                      onClick={() => {
                        if (!window.confirm("Eliminar esta categoria?")) return;
                        runAction(async () => {
                          await deleteCategory(token, cat.id);
                          await refreshData();
                        }, "Categoria eliminada.");
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </PageShell>
  );
}
