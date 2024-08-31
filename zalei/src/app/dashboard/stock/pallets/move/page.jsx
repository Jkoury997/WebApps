"use client";

import { useState,useEffect} from "react";
import QrScannerComponent from "@/components/component/qr-scanner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert"; // Verifica que la ruta sea correcta
import DepositoInfo from "@/components/ui/deposit-info"; // Verifica que la ruta sea correcta
import { Button } from "@/components/ui/button"; // Verifica que la ruta sea correcta
import ListPackets from "@/components/component/list-packed";
import StatusBadge from "@/components/ui/badgeAlert";

export default function Page() {
  const [isFirstScanComplete, setIsFirstScanComplete] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [error, setError] = useState(null);
  const [successBadge, setSuccessBadge] = useState(null);
  const [errorBadge, setErrorBadge] = useState(null);
  const [success, setSuccess] = useState(null);
  const [availableDeposits, setAvailableDeposits] = useState([]);
  const [depositOrigin, setDepositOrigin] = useState(null);
  const [depositFinal, setDepositFinal] = useState(null);
  const [scannedPackages, setScannedPackages] = useState([]);
  const [scannedUUIDs, setScannedUUIDs] = useState([]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isFirstScanComplete) {
        event.preventDefault();
        event.returnValue = ""; // Es necesario para mostrar la alerta en algunos navegadores
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFirstScanComplete]);

  const fetchDeposits = async () => {
    try {
      const response = await fetch("/api/syndra/catalogo/almacenespallets");
      const data = await response.json();
      if (response.ok && data.Estado) {
        setAvailableDeposits(data.Almacenes);
        return data.Almacenes;
      } else {
        setError(data.error || "Error al obtener los depósitos");
        return null;
      }
    } catch (err) {
      setError("Error al realizar la solicitud");
      return null;
    }
  };

  const handleScanOrigin = async (scannedData) => {
    setError(null);
    console.log("Depósito de origen escaneado:", scannedData);

    const deposits = await fetchDeposits();

    if (!deposits) {
      setError("No se pudieron obtener los depósitos.");
      return;
    }

    const foundDeposit = deposits.find(
      (deposit) => deposit.Codigo === scannedData
    );

    if (foundDeposit) {
      setDepositOrigin(foundDeposit);
      setSuccess("Depósito Origen confirmado.");
      setActiveStep(2);
      setIsFirstScanComplete(true); // Marcamos que el primer escaneo se ha completado
    } else {
      setError(
        "Depósito de origen no encontrado en la lista de depósitos disponibles."
      );
    }
  };

  const handleScanFinal = async (scannedData) => {
    setSuccess(null);
    setError(null);
    console.log("Depósito final escaneado:", scannedData);

    const foundDeposit = availableDeposits.find(
      (deposit) => deposit.Codigo === scannedData
    );

    // Verificar si el depósito final es el mismo que el depósito de origen
    if (foundDeposit && foundDeposit.Codigo === depositOrigin?.Codigo) {
      setError("Depósito Final no puede ser igual al Depósito Origen.");
      return;
    }

    if (foundDeposit) {
      setDepositFinal(foundDeposit);
      setSuccess("Depósito Final confirmado.");
      setActiveStep(3); // Avanzar al siguiente paso
    } else {
      setError(
        "Depósito final no encontrado en la lista de depósitos disponibles."
      );
    }
  };

  const fetchCheckPaquete= async (IdPaquete) => {
    try {
      const response = await fetch(`/api/syndra/avicola/pallet/list/id?IdPallet=${IdPaquete}`, {
        method: 'GET',
      });

      const data = await response.json();
      return data.List
    } catch (error) {
      console.error("Error checking paquete:", error);
      setSuccessBadge("")
      setErrorBadge("Error al verificar el paquete.");
      return false;
    }
  };


  const fetchMovePaquete = async (IdPaquete) => {
    try {
        const response = await fetch('/api/syndra/avicola/pallet/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                IdPallet: IdPaquete,
                AlmacenOrigen: depositOrigin.Codigo,
                AlmacenDestino: depositFinal.Codigo,
            }),
        });

        const responseData = await response.json();

        if (response.ok && responseData.Estado) {
            return responseData.Estado;
        }
    } catch (error) {
        console.error("Error moving paquete:", error);
        setSuccessBadge("")
        setErrorBadge("Error al mover el paquete.");
        return false;
    }
};



  const handleScanPackage = async (scannedData) => {
    setSuccess(null);
    setError(null);
    setErrorBadge(null)
    setSuccessBadge(null);

    try {
      const parsedData = JSON.parse(scannedData);
      const { uuid, IdPaquete } = parsedData;
      console.log(scannedUUIDs);
      // Verificar si el UUID ya ha sido escaneado
      if (scannedUUIDs.includes(uuid)) {
        setSuccessBadge("");
        setErrorBadge(`El paquete ${IdPaquete} ya ha sido escaneado.`);
        return;
      }

      const paqueteExiste = await fetchCheckPaquete(IdPaquete)
      if (!paqueteExiste) {
        setSuccessBadge("");
        setErrorBadge(`El Paquete ${IdPaquete} no se encontró.`);
        return;
      }

      console.log(paqueteExiste)

      const almacenPaquete = paqueteExiste[0].Almacen.trim()

      if(almacenPaquete !== depositOrigin.Codigo){
        setSuccessBadge("");
        setErrorBadge(`El paquete ${IdPaquete} pertenece a un almacén de origen: ${almacenPaquete}.`);
        return
      }

      // Intentar mover el pallet
      const movePaquete = await fetchMovePaquete(IdPaquete);
      if (!movePaquete) {
        setSuccessBadge("");
        setErrorBadge(`Error al mover el pallet ${IdPaquete}.`);
        return;
      }
  

      // Añadir el UUID al array de UUIDs escaneados y el paquete a los paquetes escaneados
      scannedUUIDs.push(uuid);
      setScannedPackages((prevPackages) => [...prevPackages, parsedData]);
      
      setSuccessBadge(`Paquete ${IdPaquete} se movio con éxito.`);
      setErrorBadge("")
    } catch (error) {
      setErrorBadge("Error al procesar el paquete escaneado.");
    }
  };

  const handleRestart = async () => {
    setError(null);
    setSuccess(null);
    setSuccessBadge(null)
    setErrorBadge(null)
    setAvailableDeposits([]);
    setDepositOrigin(null);
    setDepositFinal(null);
    setScannedPackages([]);
    setScannedUUIDs([]);
    setActiveStep(1);
  };

  return (
    <>
      {error && (
        <div className="mb-4">
          <Alert type="error" title="Error" message={error} />
        </div>
      )}
      {success && (
        <div className="mb-4">
          <Alert type="success" title="Éxito" message={success} />
        </div>
      )}

      <Card>
        <CardContent className="grid gap-4 p-1 pt-4 pb-4">
          {activeStep === 1 && (
            <QrScannerComponent
              onScanSuccess={handleScanOrigin}
              title="Deposito Origen"
              description="Escanar el QR del deposito de origen"
            />
          )}
          {activeStep === 2 && (
            <>
              <DepositoInfo depositoOrigen={depositOrigin} />
              <QrScannerComponent
                onScanSuccess={handleScanFinal}
                title="Depósito Final"
                description="Escanar el QR del deposito de destino"
              />
            </>
          )}
          {activeStep === 3 && (
            <>
              <DepositoInfo
                depositoOrigen={depositOrigin}
                depositoFinal={depositFinal}
              />
                {successBadge && <StatusBadge type="success" text={successBadge} />}
                {errorBadge && <StatusBadge type="error" text={errorBadge} />}
              <QrScannerComponent
                onScanSuccess={handleScanPackage}
                title="Escanear Paquete"
              />
              {scannedPackages.length > 0 && (
                <>
                  <ListPackets paquetes={scannedPackages} />{" "}
                  {/* Mostrar los paquetes escaneados */}
                  <Button className="ms-4 me-4" onClick={handleRestart}>
                    Finalizar
                  </Button>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
