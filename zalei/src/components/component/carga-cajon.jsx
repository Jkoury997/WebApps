"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateCajon } from "@/utils/cajonUtils";
import { Alert } from "@/components/ui/alert"; // Usamos el componente de alerta existente
import { StepIndicator } from "@/components/component/step-indicartor";
import { StepContent } from "@/components/component/step-content";
import shortUUID from 'short-uuid'; // Importa la librería short-uuid

export function CargaCajon() {
  const [activeStep, setActiveStep] = useState(1);
  const [barcode, setBarcode] = useState("");
  const [Cantidad, setCantidad] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [IdArticulo, setIdArticulo] = useState(null);
  const [FullCode, setFullCode] = useState(null);
  const [alert, setAlert] = useState({ visible: false, type: '', title: '', message: '' });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [qrData, setQrData] = useState(null);
  const router = useRouter();

  const handleNextStep = (data, response) => {
    if (activeStep === 1 && data) {
      setBarcode(data);
      setApiResponse(response);
      setIdArticulo(response.Articulo.IdArticulo);
      setFullCode(response.Articulo.FullCode);
      setActiveStep(2);
    }
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCreate = async () => {
    try {
      setIsButtonDisabled(true);
      const responseCreateCajon = await CreateCajon({ IdArticulo, Cantidad });
      setAlert({
        visible: true,
        type: 'success',
        title: 'Éxito',
        message: 'El cajón ha sido creado correctamente.'
      });
      // Genera un UUID corto
      const uuid = shortUUID.generate();

      // Almacena los datos del QR incluyendo el UUID corto en formato JSON
      const qrDataObject = {
        uuid,
        IdArticulo,
        Cantidad,
        FullCode
      };
      setQrData(JSON.stringify(qrDataObject));
      setActiveStep(3);
    } catch (error) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'Hubo un problema al crear el cajón: ' + error.message
      });
      setIsButtonDisabled(false);
    }
  };

  const handleCreateAnother = () => {
    setActiveStep(1);
    setBarcode("");
    setCantidad("");
    setApiResponse(null);
    setIdArticulo(null);
    setFullCode(null);
    setQrData(null);
    setAlert({ visible: false, type: '', title: '', message: '' });
    setIsButtonDisabled(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex flex-col items-center">
          <StepIndicator activeStep={activeStep} />
          <h1 className="text-3xl font-bold mb-2 text-center">Crear Cajón</h1>
          <p className="text-muted-foreground text-center">
            Utiliza este formulario para crear un nuevo cajón en el sistema.
          </p>
        </div>
        {alert.visible && (
          <div className="mb-6">
            <Alert type={alert.type} title={alert.title} message={alert.message} />
          </div>
        )}
        <Card>
          <CardContent className="grid gap-4 pt-6">
            <StepContent
              activeStep={activeStep}
              handleNextStep={handleNextStep}
              Cantidad={Cantidad}
              setCantidad={setCantidad}
              apiResponse={apiResponse}
              qrData={qrData}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            {activeStep > 1 && activeStep < 3 && (
              <Button variant="outline" onClick={handlePrevStep} disabled={isButtonDisabled}>
                Anterior
              </Button>
            )}
            {activeStep === 2 && (
              <Button onClick={handleCreate} className="ml-auto" disabled={isButtonDisabled}>
                Cargar
              </Button>
            )}
            {activeStep === 3 && (
              <>
                <Button onClick={handleCreateAnother} className="mx-auto bg-white text-gray-800 border border-gray-800 hover:bg-gray-600 hover:text-white">
                  Crear otro cajón
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
