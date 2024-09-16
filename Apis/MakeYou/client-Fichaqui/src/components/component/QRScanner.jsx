import React, { forwardRef, useState, useEffect, useImperativeHandle } from "react";
import dynamic from "next/dynamic";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TriangleAlertIcon } from "lucide-react";

// Importar react-qr-scanner dinámicamente para evitar problemas con SSR
const QrScanner = dynamic(() => import("react-qr-scanner"), { ssr: false });

const QRScanner = forwardRef(({ error, handleScan, handleError }, ref) => {
  const [isSupported, setIsSupported] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(true);
  const [loading, setLoading] = useState(true); // Estado para manejar el tiempo de espera
  const [scannerKey, setScannerKey] = useState(0);

  useEffect(() => {
    // Verificar la compatibilidad de getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      setLoading(false); // Terminar el estado de carga si no es compatible
    } else {
      // Solicitar permiso para acceder a la cámara
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          setPermissionGranted(true);
          setLoading(false); // Terminar el estado de carga cuando se otorguen los permisos
          stream.getTracks().forEach(track => track.stop()); // Detener la transmisión una vez obtenida la aprobación
        })
        .catch(() => {
          setPermissionGranted(false);
          setLoading(false); // Terminar el estado de carga si los permisos son rechazados
        });
    }
  }, []);

  useImperativeHandle(ref, () => ({
    resetScanner: () => {
      setScannerKey(prevKey => prevKey + 1); // Reiniciar el escáner cambiando la key
    }
  }));

  const previewStyle = {
    height: 300,
    width: '100%',
  };

  if (loading) {
    return (
      <section ref={ref} className="w-full p-1">
        <Alert variant="default">
          <TriangleAlertIcon className="h-4 w-4" />
          <AlertDescription>
            Preparando la cámara...
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  if (!isSupported) {
    return (
      <section ref={ref} className="w-full p-1">
        <Alert variant="destructive">
          <TriangleAlertIcon className="h-4 w-4" />
          <AlertDescription>
            Este dispositivo no soporta la API de getUserMedia necesaria para el escaneo de QR.
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  if (!permissionGranted) {
    return (
      <section ref={ref} className="w-full p-1">
        <Alert variant="destructive">
          <TriangleAlertIcon className="h-4 w-4" />
          <AlertDescription>
            No se ha concedido permiso para acceder a la cámara.
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  return (
    <section ref={ref} className="w-full p-1">
      <div className="w-full max-w-md">
        {error ? (
          <Alert variant="destructive">
            <TriangleAlertIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <QrScanner
            key={scannerKey} // Cambiar la key reiniciará el componente
            delay={300}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
            constraints={{ video: { facingMode: "user" } }}
          />
        )}
      </div>
    </section>
  );
});

QRScanner.displayName = 'QRScanner';

export default QRScanner;
