"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";

export function SearchBar({ defaultQuery = "" }: { defaultQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (query.trim().length < 2) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar oportunidades, organizaciones..."
        aria-label="Buscar"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-teal px-4 text-sm font-semibold text-white hover:bg-teal-light"
      >
        Buscar
      </button>
    </form>
  );
}
