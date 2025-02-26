import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import QRScanner from '@/components/component/QRScanner';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { openFullscreen } from '@/utils/fullscreen'; // Función extraída a un utilitario
import { ExpandIcon } from 'lucide-react';

export default function CameraZoneConfig() {
  const [message, setMessage] = useState('');
  const [zoneUUID, setZoneUUID] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const qrRef = useRef(null);

  // Verifica que el modo de lectura sea "camera"
  useEffect(() => {
    const readingMode = localStorage.getItem('readingMode');
    if (readingMode !== 'camera') {
      router.push('/zone/configure');
    }
  }, [router]);

  // Función para generar el fingerprint
  const generateFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  };

  // Maneja el escaneo del QR
  const handleScan = async (data) => {
    if (data) {
      const qrGeneralUUID = data.text; // Asumimos que el componente QRScanner devuelve un objeto con la propiedad "text"
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
        <h1 className="text-2xl font-bold">Configurar la zona (Cámara)</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Escanee el código QR para configurar la zona.
        </p>
        <QRScanner 
          ref={qrRef}
          error={error}
          handleScan={handleScan}
          handleError={(err) => setError('Error al escanear el QR.')}
        />
        {message && <p className="mt-4 text-center">{message}</p>}
        {zoneUUID && <p className="mt-4 text-center text-green-500">Zona: {zoneUUID}</p>}
      </div>
    </div>
  );
}
