import type { Metadata } from "next";
import LoginPage from "./LoginPage";

export const metadata: Metadata = {
  title: "Iniciar sesion",
  description:
    "Accede a tu cuenta de Conecta Joven Cartagena y descubre oportunidades juveniles.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return <LoginPage />;
}
