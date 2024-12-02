import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from "@/components/ui/button";

export default function QrScannerComponent({
  title,
  description,
  onScanSuccess, // Callback para el resultado del escaneo
  stopScanner,   // Nueva propiedad para detener el escáner
}) {
  const [scanning, setScanning] = useState(false);
  const [scannerStarted, setScannerStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Estado para manejar la pausa
  const scannerId = 'html5qr-code-full-region';
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    if (stopScanner) {
      stopScanner(() => stopScanning());
    }
  }, [stopScanner]);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Este dispositivo no soporta la API de getUserMedia necesaria para el escaneo de QR.');
    }
  }, []);

  useEffect(() => {
    if (scanning) {
      startScanning();
    }

    return () => stopScanning();
  }, [scanning]);

  const startScanning = () => {
    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode(scannerId);
    }

    html5QrCodeRef.current.start(
      { facingMode: "environment" },
      {
        fps: 5,
        qrbox: 250
      },
      handleScan
    ).then(() => {
      setScannerStarted(true);
    }).catch(err => {
      console.error('Ocurrió un error al intentar iniciar el escaneo:', err);
      setScanning(false);
    });
  };

  const stopScanning = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear();
      }).catch(err => {
        console.error('Error al detener el escaneo:', err);
      });
    }
  };

  const handleScan = (data) => {
    if (data && !isPaused) {
      if (onScanSuccess) {
        onScanSuccess(data); // Llama a la función de callback para enviar el resultado
      }

      // Pausar el escaneo inmediatamente después de la lectura exitosa
      html5QrCodeRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeScanning = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.resume();
      setIsPaused(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-2">
      <div className="max-w-md w-full px-4 sm:px-6">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-muted-foreground">{description}</p>
          </div>
          {!scannerStarted && (
            <Button size="lg" className="w-full" onClick={() => setScanning(true)}>
              Iniciar Escáner
            </Button>
          )}
          {scanning && (
            <div className='border p-2 rounded shadow-none bg-white' id={scannerId} style={{ width: '100%' }} />
          )}
          {isPaused && (
            <Button size="m" className="w-full mt-1" onClick={resumeScanning}>
              Escanear de nuevo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
