// ReaderZoneConfig.jsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { openFullscreen } from '@/utils/fullscreen'; // Función reutilizable para pantalla completa
import { ExpandIcon } from 'lucide-react';

export default function ReaderZoneConfig() {
  const [message, setMessage] = useState('');
  const [zoneUUID, setZoneUUID] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const inputRef = useRef(null);

  // Verificar que el modo de lectura sea "reader" y enfocar el input al montar
  useEffect(() => {
    const readingMode = localStorage.getItem('readingMode');
    if (readingMode !== 'reader') {
      router.push('/zone/configure');
      return;
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [router]);

  // Función para generar el fingerprint (trustdevice)
  const generateFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  };

  // Maneja el valor ingresado en el input (escaneo del QR)
  const handleScan = async (value) => {
    const qrGeneralUUID = value.trim().replace(/[´_,’'–—\s]/g, '-');
    if (qrGeneralUUID) {
      setZoneUUID(qrGeneralUUID);
      try {
        const trustdevice = await generateFingerprint();
        const response = await fetch('/api/qrfichaqui/zones/link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            zoneId: qrGeneralUUID,
            trustdevice,
          }),
        });
        if (!response.ok) {
          throw new Error('Error al configurar el dispositivo');
        }
        localStorage.setItem('trustdevice', trustdevice);
        setMessage(`Dispositivo configurado para la zona: ${qrGeneralUUID}`);
        router.push('/zone/reader');
      } catch (err) {
        setError('Error al realizar la acción con el UUID. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <button onClick={openFullscreen} className="absolute top-4 right-4 bg-blue-500 text-white py-2 px-4 rounded">
        <ExpandIcon />
      </button>
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold">Configurar la zona (Lector)</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Ingrese el código QR (usando el lector) para configurar la zona.
        </p>
        <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
          <input
            ref={inputRef}
            type="text"
            placeholder="Escanea el código QR aquí"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleScan(e.target.value);
                e.target.value = ''; // Limpiar el input después del escaneo
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>
        {message && <p className="mt-4 text-center">{message}</p>}
        {zoneUUID && <p className="mt-4 text-center text-green-500">Zona: {zoneUUID}</p>}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
}
