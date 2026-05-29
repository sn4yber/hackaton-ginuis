import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Panel",
  description: "Gestiona tu perfil y el contenido de Conecta Joven Cartagena.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
