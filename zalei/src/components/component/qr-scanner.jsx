import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from "@/components/ui/button";
import ListTable from '@/components/component/list-table';
import { Alert } from "@/components/ui/alert";

export default function QrScannerComponent() {
  const [scanResults, setScanResults] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scannedCodes, setScannedCodes] = useState(new Set());
  const [alert, setAlert] = useState({ show: false, type: '', title: '', message: '' });
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [scannerStarted, setScannerStarted] = useState(false);
  const scannerId = 'html5qr-code-full-region';
  const html5QrCodeRef = useRef(null);
  const lastScanTimeRef = useRef(0);
  const isComponentMounted = useRef(true);

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
      isComponentMounted.current = false;
    };
  }, [scanResults]);

  useEffect(() => {
    if (scanning) {
      startScanning();
    }

    return () => stopScanning();
  }, [scanning]);

  const startScanning = () => {
    setError(null);
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
      console.error(err);
      setError('Ocurrió un error al intentar iniciar el escaneo. Por favor, inténtalo de nuevo.');
      setCameraPermissionDenied(true);
      setScanning(false);
    });
  };

  const stopScanning = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        if (isComponentMounted.current) {
          html5QrCodeRef.current.clear();
        }
      }).catch(err => {
        console.error(err);
        if (isComponentMounted.current) {
          setError('Ocurrió un error al intentar detener el escaneo. Por favor, inténtalo de nuevo.');
        }
      });
    }
  };

  const handleScan = async (data) => {
    const currentTime = Date.now();
    if (data && currentTime - lastScanTimeRef.current > 1000) {
      lastScanTimeRef.current = currentTime;

      const parsedData = JSON.parse(data);

      if (scannedCodes.has(parsedData.uuid)) {
        showAlert('error', 'Error', 'El código QR ya ha sido escaneado.');
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

        setScanResults(prevResults => [...prevResults, parsedData]);
        setError(null);
        showAlert('success', 'Success', 'Código QR escaneado con éxito.');
      } else {
        showAlert('error', 'Error', result.message);
      }
    }
  };

  const handleError = (err) => {
    if (!err.message.includes("No MultiFormat Readers were able to detect the code")) {
      console.error(err);
      showAlert('error', 'Error', 'Ocurrió un error al intentar escanear el código QR. Por favor, inténtalo de nuevo.');
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
        setError(null);
        showAlert('success', 'Success', 'Código QR eliminado con éxito.');
      } else {
        showAlert('error', 'Error', result.message);
      }
    } catch (error) {
      console.error('Error al eliminar el código:', error);
      showAlert('error', 'Error', 'Ocurrió un error al eliminar el código.');
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
        setScanResults([]);
        setScannedCodes(new Set());
        setError(null);
        showAlert('success', 'Success', 'Datos enviados correctamente.');
      } else {
        showAlert('error', 'Error', result.message);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      showAlert('error', 'Error', 'Ocurrió un error al enviar los datos.');
    }
  };

  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', title: '', message: '' });
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center mt-4 h-screen bg-background">
      <div className="max-w-md w-full px-4 sm:px-6">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Escáner de Códigos QR</h1>
            <p className="mt-2 text-muted-foreground">Escanea códigos QR con tu dispositivo móvil.</p>
          </div>
          {!scannerStarted && (
            <Button size="lg" className="w-full" onClick={() => setScanning(true)}>
              Iniciar Escáner
            </Button>
          )}
          {scannerStarted && (
            <Button size="lg" className="w-full mt-4" onClick={() => window.location.href = '/dashboard/stock/pallets'}>
              Ir a enlace
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
          {alert.show && (
            <div className="mt-4">
              <Alert type={alert.type} title={alert.title} message={alert.message} />
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
