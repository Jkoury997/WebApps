"use client";
import React, { useState, useEffect } from "react";
import QrScannerComponent from "@/components/component/qr-scanner";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert"; // Asegúrate de ajustar la ruta según la ubicación del componente

export default function Page() {
  const [step, setStep] = useState(1);
  const [originWarehouse, setOriginWarehouse] = useState("");
  const [destinationWarehouse, setDestinationWarehouse] = useState("");
  const [scannedPackages, setScannedPackages] = useState(new Set()); // Para evitar escaneos duplicados
  const [uuidArray, setUuidArray] = useState([]); // Array para almacenar los UUID
  const [readPackages, setReadPackages] = useState([]); // Definir el estado para los paquetes leídos
  const [originDescription, setOriginDescription] = useState("");
  const [destinationDescription, setDestinationDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false); // Estado para manejar bloqueo temporal

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch('/api/syndra/catalogo/almacenespallets', {
          method: 'GET',
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener los almacenes.');
        }

        const data = await response.json();
        setWarehouses(data.Almacenes || []);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
        setError("Error al cargar los almacenes.");
      }
    };

    fetchWarehouses();
  }, []);

  const handleScanSuccess = async (data) => {
    setError("");
    setSuccess("");

    if (step === 1) {
      const warehouse = warehouses.find((warehouse) => warehouse.Codigo === data);

      if (!warehouse) {
        setError(`El código ${data} no se encontró en los almacenes.`);
        return;
      }

      setOriginWarehouse(data);
      setOriginDescription(warehouse.Descripcion);
    } else if (step === 2) {
      if (data === originWarehouse) {
        setError("El depósito de destino no puede ser el mismo que el depósito de origen.");
        return;
      }

      const warehouse = warehouses.find((warehouse) => warehouse.Codigo === data);

      if (!warehouse) {
        setError(`El código ${data} no se encontró en los almacenes.`);
        return;
      }

      setDestinationWarehouse(data);
      setDestinationDescription(warehouse.Descripcion);
    }
  };

  const handleScanSuccessPaquetes = async (data) => {
    setError("");
    setSuccess("");
  
    // Verificar si una operación ya está en curso
    if (isProcessing) {
      setError("El procesamiento de un paquete anterior aún está en curso. Por favor, espera.");
      return;
    }
  
    // Bloquear nuevas operaciones mientras se procesa la actual
    setIsProcessing(true);
  
    try {
      const parsedData = await JSON.parse(data); // Parsear el JSON del QR
      const { uuid, IdPaquete } = parsedData;
  
      // Verificar si el uuid ya ha sido escaneado
      if (uuidArray.includes(uuid)) {
        setError("Este paquete ya ha sido escaneado.");
        console.log("Este paquete ya ha sido escaneado.");
        return; // Salir sin procesar más
      }
  
      // Verificar si el pallet existe
      const palletExists = await checkPalletExists(IdPaquete);
  
      if (palletExists) {
        // Mover el pallet si existe
        const moveSuccess = await movePallet(IdPaquete);
        if (moveSuccess) {
          // Agregar el uuid al array de UUIDs
          setUuidArray((prev) => [...prev, uuid]);
  
          // Agregar el paquete a la lista de QR leídos
          setReadPackages((prev) => {
            if (!prev.some(pkg => pkg.uuid === uuid)) {
              return [...prev, parsedData];
            }
            return prev;
          });
  
          setSuccess(`El pallet ${IdPaquete} ha sido movido exitosamente.`);
          // Pausar el escaneo por medio segundo antes de permitir otra lectura
          setPauseScan(true);
          setTimeout(() => {
            setPauseScan(false);
          }, 500);
        } else {
          setSuccess("");
          setError(`Error al mover el pallet ${IdPaquete}.`);
          
        }
      } else {
        setSuccess("");
        setError(`El pallet ${IdPaquete} no se encontró.`);
        
      }
    } catch (error) {
      setError("Error al procesar el paquete escaneado.");
      console.error("Error parsing package data:", error);
    } finally {
      // Permitir nuevas operaciones después de que se complete el procesamiento
      setIsProcessing(false);
    }
  };
  

  const checkPalletExists = async (idPallet) => {
    try {
      const response = await fetch(`/api/syndra/avicola/pallet/list/id?IdPallet=${idPallet}`, {
        method: 'GET',
      });

      const data = await response.json();

      return data.List && data.List.length > 0;
    } catch (error) {
      console.error("Error checking pallet:", error);
      setError("Error al verificar el pallet.");
      return false;
    }
  };

  const movePallet = async (idPallet) => {
    try {
        const response = await fetch('/api/syndra/avicola/pallet/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Agrega otros encabezados necesarios aquí
            },
            body: JSON.stringify({
                IdPallet: idPallet,
                AlmacenOrigen: originWarehouse,
                AlmacenDestino: destinationWarehouse,
            }),
        });

        const responseData = await response.json();

        if (response.ok && responseData.Estado) {
            // Movimiento completado exitosamente
            return true;
        } else {
            // Manejo de errores específicos de la API
            console.error('Error al mover el pallet:', responseData.Mensaje || 'Failed to move pallet');
            setError(responseData.Mensaje || 'Error al mover el pallet.');
            return false;
        }
    } catch (error) {
        // Manejo de errores generales
        console.error("Error moving pallet:", error);
        setError("Error al mover el pallet.");
        return false;
    }
};


  const handleNextStep = () => {
    setStep(step + 1);
  };

  return (
    <div className="flex items-center justify-center mt-2">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle>Transferir Cajón</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {error && <Alert type="error" title="Error" message={error} />}
          {success && <Alert type="success" title="Éxito" message={success} />}
          {step === 1 && (
            <>
              <QrScannerComponent
                title="Depósito de Origen"
                description="Escanea el código QR del depósito de origen."
                onScanSuccess={handleScanSuccess}
              />
              {originWarehouse && (
                <p><strong>Origen:</strong> {originWarehouse} - {originDescription}</p>
              )}
              {originWarehouse && (
                <Button className="w-full mt-4" onClick={handleNextStep}>
                  Siguiente
                </Button>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <QrScannerComponent
                title="Depósito de Destino"
                description="Escanea el código QR del depósito de destino."
                onScanSuccess={handleScanSuccess}
              />
              {destinationWarehouse && (
                <p><strong>Destino:</strong> {destinationWarehouse} - {destinationDescription}</p>
              )}
              {destinationWarehouse && (
                <Button className="w-full mt-4" onClick={handleNextStep}>
                  Siguiente
                </Button>
              )}
            </>
          )}
          {step === 3 && (
            <>
              <QrScannerComponent
                title="Escanear Paquete"
                description="Escanea el código QR del paquete."
                onScanSuccess={handleScanSuccessPaquetes}
              />
              {readPackages.length > 0 && (
  <div className="mt-4 bg-white shadow rounded-lg p-4">
    <h3 className="text-lg font-bold mb-4">Paquetes leídos:</h3>
    <ul className="divide-y divide-gray-200">
      {readPackages.map((pkg, index) => (
        <li key={index} className="py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">{pkg.FullCode}</p>
            <p className="text-sm text-gray-500">Cantidad: {pkg.Cantidad} unidades</p>
          </div>
          <div>
            <span className="text-xs text-green-500 bg-green-100 p-2 rounded-xl">Aprobado</span>
          </div>
        </li>
      ))}
    </ul>
      <div className="flex justify-center mt-4">
        <Button className="justify-center" onClick={() => window.location.reload()}>
          Terminar
        </Button>
        </div>
      </div>
        )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
