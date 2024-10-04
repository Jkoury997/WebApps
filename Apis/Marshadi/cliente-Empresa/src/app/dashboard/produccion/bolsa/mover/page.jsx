"use client";
import { StepIndicator } from "@/components/component/step-indicartor";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import QrScannerComponent from "@/components/component/qr-scanner";
import { EmployeDetails } from "@/components/ui/details/employed-details";
import { BolsaDetails } from "@/components/ui/details/bolsa-details";
import { Alert } from "@/components/ui/alert";
import { BoxesIcon, PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProcessDetails } from "@/components/ui/details/process-details";



export default function Page() {
  const [activeStep, setActiveStep] = useState(1);
  const [alertMessage, setAlertMessage] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [listBolsa, setListBolsa] = useState([]);
  const [bolsa, setBolsa] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [proceso,setProceso] = useState(null)
  const [falladosCount, setFalladosCount] = useState(null); // Estado para la cantidad de fallados

  const handleScanPersona = async (data) => {
    setAlertMessage(null)
    setLoading(true);
    if (data) {
      console.log(data);
      try {
        setScanned(false);
        const parsedData = await JSON.parse(data);

        const response = await fetch(
          `/api/zyra/catalogo/personal?id=${parsedData.CodPersona}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching data");
        }

        const result = await response.json();
        console.log("API Result Personal:", result);
        setEmploye(result);
        setScanned(true);
        setActiveStep(2);
      } catch (error) {
        console.error("Error:", error);
        setAlertMessage({
            type: "error",
            message: "Por favor scane un QR de personal valido.",
          });
        setScanned(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleScanProceso = async (data) => {
    setAlertMessage(null)
    setLoading(true);
    if (data) {
      console.log(data);
      try {
        setScanned(false);
        const parsedData = await JSON.parse(data);

        const response = await fetch(
          `/api/zyra/catalogo/proceso?id=${parsedData.CodProceso}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching data");
        }

        const result = await response.json();
        console.log("API Result Personal:", result);
        setProceso(result.Proceso);
        setScanned(true);
        setActiveStep(3);
      } catch (error) {
        console.error("Error:", error);
        setAlertMessage({
            type: "error",
            message: "Por favor scane un QR de personal valido.",
          });
        setScanned(false);
      } finally {
        setLoading(false);
      }
    }
  };


  const handleScanBolsa = async (data) => {
    setAlertMessage(null);
    setLoading(true);

  
    if (data) {
      console.log(data);
      try {
        setScanned(false);
        const parsedData = await JSON.parse(data);
        console.log(parsedData);
  
        // Verificar si el IdBolsa ya está en la lista de bolsas
        const bolsaExistente = listBolsa.find(
          (item) => item.bolsa.Bolsa.IdBolsa === parsedData.IdBolsa
        );
  
        if (bolsaExistente) {
          setAlertMessage({
            type: "error",
            message: "Esta bolsa ya fue agregada.",
          });
          setLoading(false);
          setActiveStep(5)
          return; // No continuar si la bolsa ya está en la lista
        }
  
        const response = await fetch(
          `/api/zyra/medias/bolsa?id=${parsedData.IdBolsa}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
  
        const result = await response.json();
        console.log("API Result Bolsa:", result);
  
        // Verificar si el CodProcesoProximo coincide con 'proceso'
        if (result.Bolsa.CodProcesoProximo !== proceso.CodProceso.trim()) {
          setAlertMessage({
            type: "error",
            message: `El proceso no coincide. Se esperaba ${proceso.Descripcion}, pero se recibió ${result.Bolsa.DescProcesoProximo}.`,
          });
          setLoading(false);
          return; // No continuar si los procesos no coinciden
        }
  
        setBolsa(result);
        setScanned(true);
        setActiveStep(4);
      } catch (error) {
        console.error("Error:", error);
        setAlertMessage({
          type: "error",
          message: "Por favor scane un QR de bolsa válido.",
        });
        setScanned(false);
      } finally {
        setLoading(false);
      }
    }
  };
  
  

  const handleFalladosInput = (e) => {
    const value = parseFloat(e.target.value); // Convertir el valor de entrada a número
    // Validar si el valor es múltiplo de 0.5 o es 0
    if (value >= 0 && (value === 0 || value % 0.5 === 0)) {
      setFalladosCount(value);
    } else {
      setAlertMessage({
        type: "error",
        message: "Por favor ingresa un número válido (múltiplo de 0.5).",
      });
    }
  };

  const handleContinue = () => {
    setAlertMessage(null);
    if (falladosCount === null || falladosCount < 0) {
      setAlertMessage({
        type: "error",
        message: "Por favor ingresa una cantidad válida de fallados.",
      });
      return;
    }

    // Añadir bolsa y fallados a listBolsa
    setListBolsa((prevListBolsa) => [
      ...prevListBolsa,
      { bolsa: bolsa, fallados: falladosCount },
    ]);

    setFalladosCount(null);
    setBolsa(null)
    setActiveStep(5); // Volver a escanear otra bolsa
  };

  const handleAgregarMasBolsa = () => {
    setActiveStep(3)
  }

  const handleProcessBolsas = async () => {
    if (listBolsa.length === 0) {
      setAlertMessage({
        type: "error",
        message: "No hay bolsas para procesar.",
      });
      return;
    }

    try {
      setLoading(true);

      for (const item of listBolsa) {
        const response = await fetch(`/api/zyra/medias/contarproceso`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            IdBolsa: item.bolsa.Bolsa.IdBolsa,
            CodProceso: proceso.CodProceso.trim(),
            CodPersonal: employe.Persona.CodPersona.trim(),
            Segunda: item.fallados,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al mover la bolsa.");
        }

        const result = await response.json();
        console.log("Bolsa procesada:", result);
      }

      setAlertMessage({
        type: "success",
        message: "Todas las bolsas han sido procesadas exitosamente.",
      });
      handleReset()
    } catch (error) {
      setAlertMessage({ type: "error", message: "Error al procesar las bolsas." });
    } finally {
      setLoading(false);
    }
  };

  


  const handleReset = () => {
    setBolsa(null)
    setListBolsa([])
    setEmploye(null)
    setFalladosCount(null)
    setActiveStep(1)
    setProceso(null)

  }

  console.log(listBolsa)

  return (
    <>
      <div className="mb-3 flex flex-col items-center">
        <StepIndicator activeStep={activeStep} steps={5} />
      </div>

      <div className="mb-2 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 text-center">Mover Bolsa</h1>
        <p className="text-muted-foreground text-center">
          Utiliza este formulario para mover una Bolsa.
        </p>
      </div>

      {alertMessage && (
        <Alert
          type={alertMessage.type}
          title={alertMessage.type === "error" ? "Error" : "Éxito"}
          message={alertMessage.message}
          onClose={() => setAlertMessage(null)}
          className="mb-2"
        />
      )}

  <div className="grid grid-cols-2">
  <EmployeDetails dataEmploye={employe}></EmployeDetails>
  <ProcessDetails dataProcess={proceso}></ProcessDetails>
  </div>
  

  {listBolsa.length > 0 && (
  <Card>
    <CardContent className="pb-2">
      <Table>
        <TableCaption className="mt-2">Lista de bolsas agregadas.</TableCaption>
        <TableHeader>
          <TableRow className="p-2">
            <TableHead className="text-center">Numero</TableHead>
            <TableHead className="text-center">Fallados</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listBolsa.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{item.bolsa.Bolsa.IdBolsa}</TableCell>
              <TableCell className="text-center">{item.fallados}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)}

      {bolsa && (
        <BolsaDetails dataBolsa={bolsa}></BolsaDetails>
      )}
      

      {activeStep === 1 && (
        <Card className="mt-2">
          <CardHeader className="pb-2">
            <CardTitle className="ms-2">Qr del Personal</CardTitle>
            <CardDescription className="ms-2">
              Scanea el código del personal
            </CardDescription>
          </CardHeader>
          <CardContent >
            <QrScannerComponent
              onScanSuccess={handleScanPersona}
            ></QrScannerComponent>
          </CardContent>
        </Card>
      )}
            {activeStep === 2 && (
        <Card className="mt-2">
          <CardHeader className="pb-2">
            <CardTitle className="ms-2">Qr del Proceso</CardTitle>
            <CardDescription className="ms-2">
              Scanea el código del Proceso
            </CardDescription>
          </CardHeader>
          <CardContent >
            <QrScannerComponent
              onScanSuccess={handleScanProceso}
            ></QrScannerComponent>
          </CardContent>
        </Card>
      )}

      {activeStep === 3 && (
        <>
          <Card className="mt-2">
            <CardHeader className="pb-2">
              <CardTitle className="ms-2">Qr Bolsa</CardTitle>
              <CardDescription className="ms-2">
                Scanea el QR de la bolsa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QrScannerComponent
                onScanSuccess={handleScanBolsa}
              ></QrScannerComponent>
            </CardContent>
          </Card>
        </>
      )}

      {activeStep === 4 && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="ms-2">¿Hay más fallados?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <Label>Ingresa la cantidad de pares fallados:</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  onChange={handleFalladosInput}
                placeholder="Para decir que NO, ingrese el numero 0"

                />
              </div>
              <Button
                onClick={handleContinue}
                disabled={loading || falladosCount === null}
                className="mt-4 w-full"
              >
                {loading ? "Cargando..." : "Continuar"}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

{activeStep === 5 && (
        <>
<Button
  className="mt-4 w-full flex items-center justify-center bg-white text-black hover:bg-gray-400"
  onClick={handleAgregarMasBolsa}
  disabled={loading || listBolsa.length === 0}
>
  {loading ? "Agregando a la lista..." : (
    <>
      <PlusIcon className="mr-2" />
      Agregar Bolsa
    </>
  )}
</Button>

          <Button
              className="mt-4 w-full flex items-center justify-center"
              onClick={handleProcessBolsas}
              disabled={loading || listBolsa.length === 0}
            >
              {loading ? "Procesando bolsas..." : (
    <>
      <BoxesIcon className="mr-2" />
      Procesar todas las bolsas
    </>
  )}
            </Button>

        </>
      )}

    </>
  );
}
