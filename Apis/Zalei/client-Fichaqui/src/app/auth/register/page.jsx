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
  const generateConsistentFingerprint = async () => {
    const fingerprints = [];
    const fp = await FingerprintJS.load();

    for (let i = 0; i < 10; i++) {
      const result = await fp.get();
      fingerprints.push(result.visitorId);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const consistentFingerprint = fingerprints.sort((a, b) =>
      fingerprints.filter(v => v === a).length - fingerprints.filter(v => v === b).length
    ).pop();

    setFingerprint(consistentFingerprint); // Guardamos el fingerprint en el estado
    console.log("Fingerprint consistente generado:", consistentFingerprint);
  };

  useEffect(() => {
    // Iniciar la generación del fingerprint al cargar la página
    generateConsistentFingerprint();
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
            {/* El código de los campos de formulario permanece igual */}
            {/* Alerta de error y botón de registro */}
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
