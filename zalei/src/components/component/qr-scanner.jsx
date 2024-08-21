import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from "@/components/ui/button";

export default function QrScannerComponent({
  title,
  description,
  onScanSuccess, // Callback prop para enviar el resultado escaneado
  onScanError,
}) {
  const [scanning, setScanning] = useState(false);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [scannerStarted, setScannerStarted] = useState(false);
  const [pauseScan, setPauseScan] = useState(false); // Estado para manejar la pausa
  const [lastScannedCode, setLastScannedCode] = useState(null); // Estado para almacenar el último código escaneado
  const scannerId = 'html5qr-code-full-region';
  const html5QrCodeRef = useRef(null);

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
    setCameraPermissionDenied(false);

    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode(scannerId);
    }

    html5QrCodeRef.current.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250
      },
      handleScan,
      handleError
    ).then(() => {
      setScannerStarted(true);
    }).catch(err => {
      console.error('Ocurrió un error al intentar iniciar el escaneo:', err);
      setCameraPermissionDenied(true);
      setScanning(false);
      if (onScanError) {
        onScanError(err);
      }
    });
  };

  const stopScanning = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear();
      }).catch(err => {
        console.error('Ocurrió un error al intentar detener el escaneo:', err);
      });
    }
  };

  const handleScan = (data) => {
    // Verificar si el código escaneado es el mismo que el anterior
    if (data && !pauseScan && data !== lastScannedCode) {
      setLastScannedCode(data); // Almacenar el último código escaneado

      if (onScanSuccess) {
        onScanSuccess(data); // Llama a la función de callback para enviar el resultado
      }

      // Pausar el escaneo por medio segundo antes de permitir otra lectura
      setPauseScan(true);
      setTimeout(() => {
        setPauseScan(false);
      }, 500);
    } else if (data === lastScannedCode) {
      console.log("Código duplicado detectado, ignorando.");
    }
  };

  const handleError = (err) => {
    if (!err.message.includes("No MultiFormat Readers were able to detect the code")) {
      console.error('Error al intentar escanear el código QR:', err);
      if (onScanError) {
        onScanError(err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="max-w-md w-full px-4 sm:px-6">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-muted-foreground">{description}</p>
          </div>
          {!scannerStarted && (
            <Button size="lg" className="w-full" onClick={() => setScanning(true)}>
              Iniciar Escáner
            </Button>
          )}
          {scanning && (
            <div id={scannerId} style={{ width: '100%' }} />
          )}
          {cameraPermissionDenied && (
            <Button size="lg" className="w-full mt-4" onClick={() => startScanning()}>
              Permitir Cámara
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
