import { SiteHeader } from "@/components/shared/SiteHeader";

export function PageShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        {title && (
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-wood-950">{title}</h1>
            {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
          </header>
        )}
        {children}
      </main>
      <footer className="border-t border-sand bg-wood-950 px-4 py-6 text-center text-sm text-sand">
        Conecta Joven Cartagena · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
