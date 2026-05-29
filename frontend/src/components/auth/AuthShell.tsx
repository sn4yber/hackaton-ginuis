import Link from "next/link";
import { cn } from "@/lib/utils";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-wood-900 px-4 py-4 lg:px-8">
        <Link href="/" className="text-base font-bold text-cream">
          conecta<span className="text-gold-light">joven</span>
        </Link>
      </header>

      <div className="mx-auto max-w-md px-4 py-12 lg:px-8">
        <h1 className="text-2xl font-bold text-wood-950">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-center text-sm text-muted">{footer}</div>
      </div>
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div
      className={cn("rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800")}
      role="alert"
    >
      {message}
    </div>
  );
}
