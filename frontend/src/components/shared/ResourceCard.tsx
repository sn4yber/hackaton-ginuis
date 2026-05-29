import Link from "next/link";

export function ResourceCard({
  href,
  title,
  description,
  badge,
  meta,
}: {
  href: string;
  title: string;
  description: string;
  badge?: string | null;
  meta?: string | null;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border-2 border-sand bg-cream p-5 transition hover:border-teal hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-wood-950">{title}</h2>
        {badge && (
          <span className="rounded-full bg-teal/10 px-3 py-0.5 text-xs font-semibold text-teal">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{description}</p>
      {meta && <p className="mt-3 text-xs font-medium text-wood-800">{meta}</p>}
    </Link>
  );
}
