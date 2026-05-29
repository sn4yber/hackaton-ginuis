"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell, FormError } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getAuthErrorMessage, useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("Cartagena");
  const [interests, setInterests] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register({
        name,
        email,
        password,
        city: city.trim() || undefined,
        interests: interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      router.push("/");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Unete a la comunidad juvenil y empieza a explorar oportunidades."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-teal hover:text-teal-light hover:underline"
          >
            Inicia sesion
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormError message={error} />

        <div>
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Tu nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Correo electronico</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Contrasena</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Minimo 6 caracteres"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </div>

        <div>
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            autoComplete="address-level2"
            placeholder="Cartagena"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="interests">Intereses (separados por coma)</Label>
          <Input
            id="interests"
            placeholder="tecnologia, liderazgo, cultura"
            value={interests}
            onChange={(event) => setInterests(event.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Crear cuenta
        </Button>
      </form>
    </AuthShell>
  );
}
