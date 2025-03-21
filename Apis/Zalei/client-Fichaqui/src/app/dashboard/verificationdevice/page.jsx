"use client";
import { useEffect, useState } from 'react';
import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function Page() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el envío y verificación del código
  const [codeSent, setCodeSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/info/userDevice");
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setError("Error al obtener la información del usuario");
      }
    } catch (err) {
      setError("Error en la petición");
      console.error("Error al hacer la petición:", err);
    } finally {
      setLoading(false);
    }
  };

  // Función para enviar el código (consulta a la API)
  const handleSendCode = async () => {
    try {
      const response = await fetch("/api/auth/recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: user?.email })
      });
      if (response.ok) {
        const data = await response.json();
        // Se asume que la respuesta es { success: true }
        setCodeSent(true);
      } else {
        setError("Error al enviar el código");
      }
    } catch (err) {
      setError("Error al enviar el código");
      console.error("Error al enviar el código:", err);
    }
  };

  // Función para generar un fingerprint utilizando FingerprintJS
  const generateFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  };

  // Función para verificar el código OTP ingresado
  const handleVerifyCode = async () => {
    setVerifyLoading(true);
    setVerifyError(null);
    try {
      const fingerprint = await generateFingerprint();
      // Aseguramos que el email esté disponible, por ejemplo, del estado "user"
      const email = user?.email;
      
      const response = await fetch("/api/auth/recovery/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ otp, email, fingerprint })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.verified) {
          console.log("Código verificado con éxito");
          // Aquí puedes redirigir o mostrar un mensaje de éxito
        } else {
          setVerifyError("Código incorrecto");
        }
      } else {
        setVerifyError("Error al verificar el código");
      }
    } catch (err) {
      setVerifyError("Error al verificar el código");
      console.error("Error al verificar el código:", err);
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Verificación de Dispositivo</CardTitle>
          {loading ? (
            <CardDescription>Cargando información...</CardDescription>
          ) : error ? (
            <CardDescription>Error: {error}</CardDescription>
          ) : (
            <CardDescription>
              Se enviará un código de seguridad a{" "}
              <span className="text-black">{user?.email || "usuario"}</span>
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          {codeSent && (
            <div className="flex flex-col items-center space-y-2">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="flex items-center justify-center">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <div className="text-center text-sm">
                {otp === "" ? (
                  <>Enter your one-time password.</>
                ) : (
                  <>You entered: {otp}</>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          {!codeSent ? (
            <Button className="w-full" onClick={handleSendCode}>
              Enviar Código
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={handleVerifyCode}
              disabled={verifyLoading || otp.length !== 6}
            >
              {verifyLoading ? "Verificando..." : "Verificar"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
