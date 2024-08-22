import { useState, useRef,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BarcodeIcon } from "lucide-react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export function ScanBarcode({ onScan }) {
  const [isPaused, setIsPaused] = useState(false); // Nuevo estado para verificar si el escáner está pausado
  const [manualCode, setManualCode] = useState(""); // Estado para manejar el código manual
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [isCameraSupported, setIsCameraSupported] = useState(true);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Este dispositivo no soporta la API de getUserMedia necesaria para el escaneo de QR.');
      setIsCameraSupported(false);
    }
  }, []);

  const handleScanBarcode = async () => {

    if (!isCameraSupported) {
      console.error('La cámara no es compatible en este dispositivo.');
      return;
    }

    try {
      setIsPaused(false); // Asegurarse de que no está pausado
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        const cameraId = devices[0].id;
        scannerRef.current = new Html5Qrcode(videoRef.current.id);

        const isMobile = window.innerWidth < 768; // Verificar si el dispositivo es móvil

        const qrboxSize = isMobile ? 250 : 300;

        scannerRef.current.start(
          { facingMode: "environment" },  // Usar la cámara trasera
          {
            fps: 20,
            qrbox: {
              width: qrboxSize,
              height: qrboxSize
            },
            formatsToSupport: [Html5QrcodeSupportedFormats.CODE_39],
            disableFlip: true,
          },
          (decodedText) => {
            onScan(decodedText);
            scannerRef.current.pause(); // Pausar el escaneo
            setIsPaused(true); // Actualizar el estado a pausado
          }
        ).catch(err => {
          console.error("Error starting the scanner: ", err);
        });
      } else {
        console.error("No cameras found.");
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  const handleScanAgain = () => {
    if (scannerRef.current) {
      scannerRef.current.resume(); // Reanudar el escaneo
      setIsPaused(false); // Actualizar el estado a no pausado
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.trim() !== "") {
      onScan(manualCode); // Llamar a onScan con el código ingresado manualmente
      setManualCode(""); // Limpiar el campo después de enviar
      setIsPaused(true); // Simular la pausa después del escaneo
    }
  };

  return (
    <div className="grid gap-2 mx-auto max-h-full mb-4">
      {!isPaused && (
        <Button variant="outline" className="ml-2" onClick={handleScanBarcode}>
          <BarcodeIcon className="w-4 h-4 mr-2" />
          Escanear codigo de barras
        </Button>
      )}
      {isPaused && (
        <Button variant="outline" onClick={handleScanAgain}>
          Escanear de nuevo
        </Button>
      )}
      <div className="mt-4 relative w-full h-48 max-h-48 overflow-hidden">
        <div id="reader" ref={videoRef} className="absolute top-0 left-0 w-full h-full"></div>
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={manualCode} // Vincula el input al estado manualCode
          onChange={(e) => setManualCode(e.target.value)} // Actualiza el estado cuando cambia el valor del input
          placeholder="Ingrese el código de barra manualmente"
          className="border rounded px-2 py-1 mr-2 hidden"
        />
        <Button variant="outline" onClick={handleManualSubmit} className="hidden">
          Aplicar
        </Button>
      </div>
    </div>
  );
}
