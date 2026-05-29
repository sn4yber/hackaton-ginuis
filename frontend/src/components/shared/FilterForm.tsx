import { Input } from "@/components/ui/Input";

export function FilterForm({
  action,
  searchPlaceholder = "Buscar...",
  defaultSearch = "",
  defaultCategory = "",
  categories = [],
}: {
  action: string;
  searchPlaceholder?: string;
  defaultSearch?: string;
  defaultCategory?: string;
  categories?: { id: string; name: string }[];
}) {
  return (
    <form action={action} method="get" className="flex flex-wrap gap-3">
      <Input
        name="search"
        defaultValue={defaultSearch}
        placeholder={searchPlaceholder}
        className="max-w-xs"
      />
      {categories.length > 0 && (
        <select
          name="category"
          defaultValue={defaultCategory}
          className="h-11 rounded-lg border-2 border-sand bg-cream px-3 text-sm text-wood-950"
        >
          <option value="">Todas las categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      )}
      <button
        type="submit"
        className="h-11 rounded-lg bg-wood-900 px-4 text-sm font-semibold text-cream hover:bg-wood-800"
      >
        Filtrar
      </button>
    </form>
  );
}
