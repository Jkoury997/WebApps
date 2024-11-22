"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default function Page() {
  const [message, setMessage] = useState('');
  const [zoneUUID, setZoneUUID] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const inputRef = useRef(null);
  const qrLinkSectionRef = useRef(null);
  const [isLinkingNewQR, setIsLinkingNewQR] = useState(false);

    // Cargar el fingerprint si no existe en localStorage
    const generateFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      return result.visitorId; // Este será el "trustdevice"
    };

    useEffect(() => {

      const checkModo = async () => {
        const readingMode = localStorage.getItem('readingMode');
        if (!readingMode) {
          router.push('/zone/configure');
          return;
        }
       }
       
  
      const trustdevice = localStorage.getItem('trustdevice');
      
      // Si trustdevice ya está en localStorage, redirigir a la página de configuración
      if (trustdevice) {
        router.push('/zone/reader');
      }
  
      if (inputRef.current) {
        inputRef.current.focus(); // Focus the input on mount
      }

      checkModo()

    }, [router]);
  

  useEffect(() => {
    if (isLinkingNewQR && qrLinkSectionRef.current) {
      qrLinkSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLinkingNewQR]);

  const handleScan = async (event) => {
    const qrGeneralUUID = event.target.value.trim().replace(/[´_,’'–—\s]/g, '-');
// Obtenemos el valor del input
    if (qrGeneralUUID) {
      setZoneUUID(qrGeneralUUID);
      try {
        // Generar el trustdevice
        const trustdevice = await generateFingerprint();

        console.log(trustdevice,qrGeneralUUID)

       // Enviar la solicitud a la API para vincular el zoneId con el trustdevice
       const response = await fetch('/api/qrfichaqui/zones/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          zoneId: qrGeneralUUID, // zoneId traído del escaneo del QR
          trustdevice: trustdevice // Enviar el trustdevice generado
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to configure device');
      }

      // Guardar el trustdevice en localStorage
      localStorage.setItem('trustdevice', trustdevice);

      setMessage(`Device configured for zone: ${qrGeneralUUID}`);

      // Redirigir a la página de configuración
      router.push('/zone/reader'); 
      } catch (err) {
        setError("Error al realizar la acción con el UUID. Por favor, intenta nuevamente.");
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("Error al escanear el código QR. Por favor, intenta nuevamente.");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Configure la zona</h1>
          <p className="text-gray-500 dark:text-gray-400">Escanea el código QR para configurar la zona.</p>
          <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg dark:bg-gray-700">
            {/* Input donde se escaneará el QR usando un lector de códigos QR como teclado */}
            <input
              ref={inputRef}
              type="text"
              onChange={handleScan}
              placeholder="Escanea el código QR aquí"
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          {message && (
            <div className="text-center mt-4">
              <p>{message}</p>
            </div>
          )}

          {zoneUUID && (
            <div className="mt-4 text-center text-green-500">
              <p>Recognized Zone UUID: {zoneUUID}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
