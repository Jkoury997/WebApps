import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BarcodeIcon } from "lucide-react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { SearchArt } from "@/utils/cajonUtils";

export function ScanBarcode({ onScan }) {
  const [isScannerInitialized, setIsScannerInitialized] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("C360-EC06-3-BLA");
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (isScannerInitialized && scannerRef.current) {
        scannerRef.current.stop().catch(err => {
          console.error("Error stopping the scanner: ", err);
        });
      }
    };
  }, [isScannerInitialized]);

  const handleScanBarcode = async () => {
    if (!isScannerInitialized) {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          const cameraId = devices[0].id;
          scannerRef.current = new Html5Qrcode(videoRef.current.id);

          scannerRef.current.start(
            cameraId,
            {
              fps: 10,
              qrbox: {
                width: videoRef.current.offsetWidth * 0.8,
                height: videoRef.current.offsetHeight * 0.8
              },
              aspectRatio: videoRef.current.offsetWidth / videoRef.current.offsetHeight,
              formatsToSupport: [Html5QrcodeSupportedFormats.CODE_39]
            },
            async (decodedText, decodedResult) => {
              console.log(`Barcode detected: ${decodedText}`);

              // Hacer consulta a la API
              try {
                const response = await SearchArt({ Fullcode: decodedText });
                console.log('API Response:', response);
                onScan(decodedText, response); // Pasar la respuesta de la API
                scannerRef.current.stop().then(() => {
                  setIsScannerInitialized(false);
                }).catch(err => {
                  console.error("Error stopping the scanner: ", err);
                });
              } catch (error) {
                console.error('Error fetching API:', error);
              }
            }
          ).then(() => {
            setIsScannerInitialized(true);
          }).catch(err => {
            console.error("Error starting the scanner: ", err);
          });
        } else {
          console.error("No cameras found.");
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    }
  };

  const handleManualSubmit = async () => {
    if (manualBarcode.trim() === "") return;

    // Hacer consulta a la API
    try {
      const response = await SearchArt({ Fullcode: manualBarcode });
      console.log('API Response:', response);
      onScan(manualBarcode, response); // Pasar la respuesta de la API
    } catch (error) {
      console.error('Error fetching API:', error);
    }
  };

  return (
    <div className="grid gap-2 mx-auto  max-h-full">
      <Button variant="outline" className="ml-2" onClick={handleScanBarcode}>
        <BarcodeIcon className="w-4 h-4 mr-2" />
        Escanear
      </Button>
      <div className="mt-4 relative w-full h-48 max-h-48 overflow-hidden">
        <div id="reader" ref={videoRef} className="absolute top-0 left-0 w-full h-full"></div>
      </div>
      <div className="mt-4 flex items-center">
        <input
          type="text"
          value={manualBarcode}
          onChange={(e) => setManualBarcode(e.target.value)}
          placeholder="Ingrese el código de barra manualmente"
          className="border rounded px-2 py-1 mr-2 "
        />
        <Button variant="outline" onClick={handleManualSubmit}>
          Aplicar
        </Button>
      </div>
    </div>
  );
}
