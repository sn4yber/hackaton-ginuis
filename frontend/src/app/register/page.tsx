import type { Metadata } from "next";
import RegisterPage from "./RegisterPage";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Registrate en Conecta Joven Cartagena y accede a convocatorias, organizaciones y espacios de participacion.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return <RegisterPage />;
}
