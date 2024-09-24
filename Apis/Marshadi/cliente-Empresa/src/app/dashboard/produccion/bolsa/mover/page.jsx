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

export default function Page() {
  const [activeStep, setActiveStep] = useState(1);
  const [alertMessage, setAlertMessage] = useState(null);
  const [employe, setEmploye] = useState(null);
  const [bolsa, setBolsa] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
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
          `/api/zyra/catalogo/personal?id=${parsedData.Persona.CodPersona}`,
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

  const handleScanBolsa = async (data) => {
    setAlertMessage(null)
    setLoading(true);
    if (data) {
      console.log(data);
      try {
        setScanned(false);
        const parsedData = await JSON.parse(data);
        console.log(parsedData);

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
        setBolsa(result);
        setScanned(true);
        setActiveStep(3);
      } catch (error) {
        console.error("Error:", error);
        setAlertMessage({
            type: "error",
            message: "Por favor scane un QR de bolsa valido.",
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

  const handleContinue = async () => {
    setAlertMessage(null)
    if (falladosCount === null || falladosCount < 0) {
      setAlertMessage({
        type: "error",
        message: "Por favor ingresa una cantidad válida de fallados.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/zyra/medias/contarproceso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdBolsa: bolsa.Bolsa.IdBolsa,
          CodProceso: bolsa.Bolsa.CodProcesoProximo,
          CodPersonal: employe.Persona.CodPersona.trim(),
          Segunda: falladosCount,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al mover la bolsa.");
      }

      const result = await response.json();
      console.log("API Result:", result);

      // Continuar al siguiente paso o mostrar éxito
      setActiveStep(4);
      setAlertMessage({
        type: "success",
        message: "Bolsa movida exitosamente.",
      });
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage({ type: "error", message: "Error al mover la bolsa." });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBolsa(null)
    setEmploye(null)
    setAlertMessage(null)
    setFalladosCount(null)
    setActiveStep(1)

  }

  return (
    <>
      <div className="mb-3 flex flex-col items-center">
        <StepIndicator activeStep={activeStep} steps={4} />
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
        <>
          <EmployeDetails dataEmploye={employe}></EmployeDetails>
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

      {activeStep === 3 && (
        <>
          <EmployeDetails dataEmploye={employe}></EmployeDetails>
          <BolsaDetails dataBolsa={bolsa}></BolsaDetails>
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

{activeStep === 4 && (
  <>

      <Button className="mt-5 w-full " onClick={handleReset}>Mover otra bolsa</Button>

  </>
)}

    </>
  );
}
