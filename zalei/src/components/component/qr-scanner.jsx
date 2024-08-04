import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from "@/components/ui/button";
import ListTable from '@/components/component/list-table';

export default function QrScannerComponent() {
  const [scanResults, setScanResults] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scannedCodes, setScannedCodes] = useState(new Set());
  const scannerId = 'html5qr-code-full-region';
  const html5QrCodeRef = useRef(null);
  const lastScanTimeRef = useRef(0); // Referencia para almacenar el tiempo del último escaneo

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Este dispositivo no soporta la API de getUserMedia necesaria para el escaneo de QR.');
    }

    const handleBeforeUnload = (e) => {
      if (scanResults.length > 0) {
        e.preventDefault();
        e.returnValue = 'Tienes datos no enviados. Si abandonas o recargas la página, se perderán.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [scanResults]);

  useEffect(() => {
    if (scanning) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => stopScanning();
  }, [scanning]);

  const startScanning = () => {
    setError(null);

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
    ).catch(err => {
      console.error(err);
      setError('Ocurrió un error al intentar iniciar el escaneo. Por favor, inténtalo de nuevo.');
      setScanning(false);
    });
  };

  const stopScanning = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear();
      }).catch(err => {
        console.error(err);
        setError('Ocurrió un error al intentar detener el escaneo. Por favor, inténtalo de nuevo.');
      });
    }
  };

  const handleScan = async (data) => {
    const currentTime = Date.now();
    if (data && currentTime - lastScanTimeRef.current > 1000) { // Verifica si han pasado 1 segundos desde el último escaneo
      lastScanTimeRef.current = currentTime;

      const parsedData = JSON.parse(data);


      if (scannedCodes.has(parsedData.uuid)) {
        setError('El código QR ya ha sido escaneado.', scannedCodes.NameEmployed );
        return;
      }

      const response = await fetch('/api/utils/codeQrScan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode: data })
      });

      const result = await response.json();
      if (response.status === 200) {
        setScannedCodes(new Set([...scannedCodes, parsedData.uuid]));

        // Agrega el nuevo objeto a la lista de resultados de escaneo
        setScanResults(prevResults => [...prevResults, parsedData]);
        setError(null); // Limpiar el mensaje de error
      } else {
        setError(result.message);
      }
    }
  };

  const handleError = (err) => {
    if (!err.message.includes("No MultiFormat Readers were able to detect the code")) {
      console.error(err);
      setError('Ocurrió un error al intentar escanear el código QR. Por favor, inténtalo de nuevo.');
    }
  };

  const deleteEntry = async (index) => {
    const uuidToDelete = scanResults[index].uuid;

    try {
      const response = await fetch('/api/utils/codeQrScan', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid: uuidToDelete })
      });

      const result = await response.json();

      if (response.status === 200) {
        const updatedResults = [...scanResults];
        updatedResults.splice(index, 1);
        setScanResults(updatedResults);

        const updatedScannedCodes = new Set(scannedCodes);
        updatedScannedCodes.delete(uuidToDelete);
        setScannedCodes(updatedScannedCodes);
        setError(null); // Limpiar el mensaje de error
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error al eliminar el código:', error);
      setError('Ocurrió un error al eliminar el código.');
    }
  };

  const handleSend = async () => {
    const dataToSend = {
      Cajones: scanResults.map(item => ({
        IdArticulo: item.IdArticulo,
        Cantidad: item.Cantidad
      }))
    };

    console.log(dataToSend);

    try {
      const response = await fetch('/api/syndra/avicola/pallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataToSend })
      });

      const result = await response.json();

      if (response.status === 200) {
        console.log('Datos enviados correctamente:', result);
        // Puedes agregar lógica adicional aquí, como vaciar la lista después de enviar
        setScanResults([]);
        setScannedCodes(new Set());
        setError(null); // Limpiar el mensaje de error
        console.log('Datos Limpiados:', result);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setError('Ocurrió un error al enviar los datos.');
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 h-screen bg-background">
      <div className="max-w-md w-full px-4 sm:px-6">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Escáner de Códigos QR</h1>
            <p className="mt-2 text-muted-foreground">Escanea códigos QR con tu dispositivo móvil.</p>
          </div>
          <Button size="lg" className="w-full" onClick={() => setScanning(!scanning)}>
            {scanning ? 'Detener Escáner' : 'Iniciar Escáner'}
          </Button>
          {scanning && (
            <div id={scannerId} style={{ width: '100%' }} />
          )}
          {error && (
            <div className="mt-4 text-center text-red-600">
              {error}
            </div>
          )}
          {scanResults.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-bold tracking-tight mb-1 ms-2">Lista de Códigos Escaneados:</h2>
              <ListTable data={scanResults} handleDelete={deleteEntry} handleSend={handleSend} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
