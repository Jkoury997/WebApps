import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export function QRPresentismo() {
  const [qrCode, setQrCode] = useState("/placeholder.svg");
  const [isVisible, setIsVisible] = useState(document.visibilityState === 'visible');

  const fetchQrCode = async () => {
    try {
      const response = await fetch("/api/qr/generate-qr");
      if (!response.ok) {
        throw new Error("Failed to fetch QR code");
      }
      const data = await response.json();
      setQrCode(data.code); // Asume que tu API devuelve la URL del código QR en un campo 'qrCodeUrl'
    } catch (error) {
      console.error("Error fetching QR code:", error);
    }
  };


  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup del event listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      fetchQrCode(); // Fetch QR code when the component first renders and is visible
      const interval = setInterval(fetchQrCode, 20000); // Fetch QR code every 20 seconds when visible

      return () => clearInterval(interval); // Cleanup interval on component unmount or visibility change
    }
  }, [isVisible]);

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="max-w-md w-full px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Registro de Asistencia</h1>
        <p className="text-gray-600">Escanea este código QR para registrar tu asistencia en el trabajo.</p>
        <div className="mt-8 flex justify-center">
        <QRCode
            alt="Código QR"
            className="w-full max-w-[256px] h-auto"
            size={256}
            style={{
              aspectRatio: "256/256",
              objectFit: "cover",
            }}
            value={qrCode}
            viewBox={`0 0 256 256`}
          />
        </div>
        <p className="text-gray-600">Tiene una validez de 15 seg.</p>
        <p className="text-gray-600">Con este código QR podrás entrar y salir del trabajo.</p>
      </div>
    </div>
  );
}