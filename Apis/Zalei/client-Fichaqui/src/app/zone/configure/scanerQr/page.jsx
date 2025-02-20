"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import QRScanner from "@/components/component/QRScanner";
import FingerprintJS from "@fingerprintjs/fingerprintjs"; // Importar FingerprintJS
import { ExpandIcon } from 'lucide-react';

function openFullscreen() {
  const elem = document.documentElement; // Puedes cambiar a un elemento específico
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}


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

  const handleScan = async (data) => {
    if (data) {
      const qrGeneralUUID = data.text; // Esto será el zoneId que obtienes del QR escaneado
      setZoneUUID(qrGeneralUUID);

      try {
        // Generar el trustdevice
        const trustdevice = await generateFingerprint();

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
                    <button
            onClick={openFullscreen}
            className="absolute top-4 right-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
           <ExpandIcon></ExpandIcon>
          </button>
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Configure la zona</h1>
          <p className="text-gray-500 dark:text-gray-400">Lea el código QR para configurar la zona.</p>
          <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg dark:bg-gray-700">
            <QRScanner
              ref={qrLinkSectionRef}
              error={error}
              handleScan={handleScan}
              handleError={handleError}
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
