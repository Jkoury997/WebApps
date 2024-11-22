'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTitle, AlertDescription, Alert } from "@/components/ui/alert";
import { login, register } from "@/utils/authUtils";
import { AlarmClock, EyeIcon, EyeOffIcon, FlagIcon, LoaderIcon, TriangleAlertIcon } from "lucide-react";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fingerprint, setFingerprint] = useState(null); // Estado para almacenar el fingerprint
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    password: "",
    confirmPassword: "",
    sex: ""
  });
  const router = useRouter();

    // Generar fingerprint consistente
    const generateAverageFingerprint = async () => {
      const fingerprints = [];
      const fp = await FingerprintJS.load();
    
      // Generamos el fingerprint 10 veces con un intervalo breve
      for (let i = 0; i < 10; i++) {
        const result = await fp.get();
        fingerprints.push(result.visitorId);
        await new Promise((resolve) => setTimeout(resolve, 200)); // Intervalo reducido
      }
    
      console.log("Fingerprints generados:", fingerprints); // Muestra todos los fingerprints generados
    
      // Seleccionamos el fingerprint más repetido
      const commonFingerprint = fingerprints.reduce((acc, fingerprint) => {
        acc[fingerprint] = (acc[fingerprint] || 0) + 1;
        return acc;
      }, {});
    
      const consistentFingerprint = Object.keys(commonFingerprint).reduce((a, b) =>
        commonFingerprint[a] > commonFingerprint[b] ? a : b
      );
    
      console.log("Fingerprint consistente seleccionado:", consistentFingerprint);
      setFingerprint(consistentFingerprint); // Guardamos el fingerprint en el estado
    };

  useEffect(() => {
    // Iniciar la generación del fingerprint al cargar la página
    generateAverageFingerprint();
  }, []);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setShowError(true);
      setIsLoading(false);
      return;
    }

    try {
      // Registrar al usuario
      const data = await register(formData);
      console.log("Registration successful:", data);

      // Enviar el fingerprint ya generado a tu API
      await fetch('/api/auth/trustdevice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fingerprint: fingerprint, // Usar el fingerprint generado previamente
        }),
      });

      // Redirigir al login después de un registro exitoso
      router.push("/auth/login");
    } catch (error) {
      console.error("Error durante el registro:", error);
      setErrorMessage(error.message);
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
            <h1 className="text-3xl font-bold">Registro</h1>
            <p className="text-gray-500 dark:text-gray-400">Crea tu cuenta</p>
          </div>
          <form className="space-y-4" onSubmit={handleSignUp}>
            {/* Formulario de registro */}
            {/* Campos de entrada */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  required
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  required
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                placeholder="12345678 sin puntos"
                required
                type="number"
                value={formData.dni}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                required
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="sex">Sexo según DNI</Label>
              <select
                id="sex"
                required
                value={formData.sex}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-gray-900 dark:bg-gray-700 dark:text-white"
              >
                <option value="" disabled>Seleccionar sexo</option>
                <option value="Male">Masculino</option>
                <option value="Female">Femenino</option>
              </select>
            </div>
            <div className="relative">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                placeholder="••••••••"
                required
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
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
            <div className="relative">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                placeholder="••••••••"
                required
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <Button
                className="absolute bottom-1 right-1 h-7 w-7"
                size="icon"
                variant="ghost"
                type="button"
                onClick={handleToggleConfirmPassword}
              >
                {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                <span className="sr-only">Toggle confirm password visibility</span>
              </Button>
            </div>
            {showError && (
              <Alert variant="destructive">
                <TriangleAlertIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
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
                  "Registrame"
                )}
              </Button>
            </div>
          </form>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <Link className="font-medium underline" href="/auth/login">
              Ya tengo cuenta. Iniciar sesión
            </Link>
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <Link className="font-medium underline" href="/auth/login">
              Recuperar contraseña o Dispositivo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
