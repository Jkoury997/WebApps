"use client"

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateCajon } from "@/utils/cajonUtils";
import { Alert } from "@/components/ui/alert";
import { StepIndicator } from "@/components/component/step-indicartor";
import { StepContent } from "@/components/component/step-content";
import shortUUID from 'short-uuid';

export function CargaCajon() {
  const [activeStep, setActiveStep] = useState(1);
  const [barcode, setBarcode] = useState("");
  const [Cantidad, setCantidad] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [IdArticulo, setIdArticulo] = useState(null);
  const [IdPaquete, setIdPaquete] = useState(null);
  const [FullCode, setFullCode] = useState(null);
  const [Galpon, setGalpon] = useState(null); // Estado para el galpón
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
    } else if (activeStep === 2 && Galpon) { // Verificamos que Galpon esté definido antes de avanzar
      setActiveStep(3);
    }
  };

  const handleCreate = async () => {
    try {
      setIsButtonDisabled(true);
      const responseCreateCajon = await CreateCajon({ IdArticulo, Cantidad });
      setIdPaquete(responseCreateCajon.IdPaquete);
      setAlert({
        visible: true,
        type: 'success',
        title: 'Éxito',
        message: 'El cajón ha sido creado correctamente.'
      });
      
      const uuid = shortUUID.generate();

      const qrDataObject = {
        uuid,
        IdArticulo,
        IdPaquete,
        Cantidad,
        FullCode,
        Galpon,
        Fecha: new Date().toLocaleDateString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      })
      };

      console.log(qrDataObject)
      setQrData(JSON.stringify(qrDataObject));
      setActiveStep(4);
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
    setGalpon(null); // Reinicia el valor de Galpon
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
              Galpon={Galpon} // Añadimos Galpon al paso
              setGalpon={setGalpon} // Pasamos el setter de Galpon
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            {activeStep > 1 && activeStep < 4 && (
              <Button variant="outline" onClick={() => setActiveStep((prev) => prev - 1)} disabled={isButtonDisabled}>
                Anterior
              </Button>
            )}
            {activeStep === 2 && Galpon && ( // Habilitamos el botón "Siguiente" si Galpon está definido
              <Button onClick={() => setActiveStep(3)} className="ml-auto" disabled={isButtonDisabled}>
                Siguiente
              </Button>
            )}
            {activeStep === 3 && (
              <Button onClick={handleCreate} className="ml-auto" disabled={isButtonDisabled}>
                Crear
              </Button>
            )}
            {activeStep === 4 && (
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
