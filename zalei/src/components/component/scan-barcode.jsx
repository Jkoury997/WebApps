import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'; // Importamos los formatos soportados
import { Button } from '../ui/button';


export default function ScanBarcode({
  title,
  description ,
  onScanSuccess, // Callback prop para enviar el resultado escaneado
}) {
  const [scanning, setScanning] = useState(false);
  const [scannerStarted, setScannerStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Estado para manejar la pausa
  const scannerId = 'html5qr-code-full-region';
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Este dispositivo no soporta la API de getUserMedia necesaria para el escaneo de códigos de barra.');
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
      { facingMode: "environment" }, // Usa la cámara trasera
      {
        fps: 10, // Fotogramas por segundo
        qrbox: 250, // Tamaño del área de escaneo
        formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13], // Solo soporte para EAN-13
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
        console.error('Ocurrió un error al intentar detener el escaneo:', err);
      });
    }
  };
  const handleScan = (data) => {
    console.log("Código escaneado: ", data); // Verifica qué datos están siendo capturados
    if (data && !isPaused) {
      onScanSuccess(data);
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
