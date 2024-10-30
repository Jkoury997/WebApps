
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertDescription, Alert } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon, LoaderIcon, TriangleAlertIcon, AlarmClock } from "lucide-react";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fecthRefreshToken = async () => {
      try {
        const response = await fetch("/api/auth/refreshtoken");
        if (!response.ok) {
          throw new Error('Error al obtener el refresh token');
        }
        const data = await response.json();
        console.log('Refresh token fetched:', data);
        router.push("/dashboard")
      } catch (error) {
        console.error('Error fetching refresh token:', error);
      }
    };

    fecthRefreshToken(); // Ejecutar la función dentro del useEffect
  }, []); 

  // Limpiar el estado del error y error de dispositivo al intentar de nuevo
  const resetError = () => {
    setShowError(false);
    setError("");
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    resetError(); // Limpiar cualquier error previo

    try {
        // Paso 1: Autenticación del usuario
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        // Verifica si la respuesta es correcta, de lo contrario arroja un error
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en el login");
        }

        // Paso 2: Obtener los datos de la respuesta (ej. tokens)
        const data = await response.json();

        // Paso 3: Verificación y redirección
        if (data.accessToken) {
            router.push("/dashboard"); // Redirigir al dashboard si la autenticación es exitosa
        } else {
            throw new Error("Token de acceso no disponible.");
        }
    } catch (error) {
        console.error("Error en el login:", error);
        setError(error.message || "Error al iniciar sesión");
        setShowError(true);
    } finally {
        setIsLoading(false);
    }
};



  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="flex justify-center">
          <AlarmClock className="h-12 w-12" />
        </div>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Fichaqui - Zalei</h1>
            <p className="text-gray-500 dark:text-gray-400">Ingrese a su cuenta</p>
          </div>
          <form className="space-y-4" onSubmit={handleSignIn}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete = "true"
              />
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link className="text-sm underline" href="/auth/recovery">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                placeholder="••••••••"
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <Button
                className="absolute bottom-1 right-1 h-7 w-7"
                size="icon"
                variant="ghost"
                type="button"
                onClick={handleTogglePassword}
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                <span className="sr-only">Toggle password visibility</span>
              </Button>
            </div>
            {showError && (
              <Alert variant="destructive">
                <TriangleAlertIcon className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex items-center justify-between">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    Cargando
                  </>
                ) : (
                  "Ingresar"
                )}
              </Button>
            </div>
          </form>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            ¿No tienes cuenta? 
            <Link className="font-medium underline" href="/auth/register">
              Crear una
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
