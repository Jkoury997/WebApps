"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import QrScannerComponent from "@/components/component/qr-scanner";
import { Alert } from "@/components/ui/alert";
import { StepIndicator } from "@/components/component/step-indicartor";
import { MachineDetails } from "@/components/ui/details/machine-details";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlanDetails } from "@/components/ui/details/plan-details";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [maquina, setMaquina] = useState("");
  const [scanned, setScanned] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [asignadosMaquina, setAsignadosMaquinas] = useState([]);
  const [iniciados, setIniciados] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  const handleScanMaquina = async (data) => {
    setAlertMessage(null);
    setLoading(true);

    if (data) {
      try {
        setScanned(false);
        const parsedData = await JSON.parse(data);

        const response = await fetch(
          `/api/zyra/catalogo/maquina?id=${parsedData.CodMaquina}`,
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
        setMaquina(result.Maquina);
        setScanned(true);

        const asignados = await fetchAsignadosMaquina(result.Maquina.CodMaquina);
        const hasIniciado = asignados.some((asignado) => asignado.Iniciado === true);
        setActiveStep(hasIniciado ? 2 : 3);
      } catch (error) {
        console.error("Error:", error);
        setAlertMessage({
          type: "error",
          message: "Por favor escanee un QR de máquina válido.",
        });
        setScanned(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchAsignadosMaquina = async (idMaquina) => {
    setAlertMessage(null);
    setLoading(true);
    try {
      const response = await fetch(
        `/api/zyra/medias/asignadomaquina?CodMaquina=${idMaquina}`,
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
      setAsignadosMaquinas(result.Asignados);

      const iniciadosFiltrados = result.Asignados.filter(
        (asignado) => asignado.Iniciado === true
      );
      setIniciados(iniciadosFiltrados[0] || null);

      return result.Asignados;
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage({
        type: "error",
        message: "Por favor escanee un QR de máquina válido.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccion = (data) => {
    console.log(data);
  };

  return (
    <>
      <div className="mb-3 flex flex-col items-center">
        <StepIndicator activeStep={activeStep} steps={4} />
      </div>

      <div className="mb-2 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 text-center">Cambiar Articulo</h1>
        <p className="text-muted-foreground text-center">
          Utiliza este formulario para cambiar el artículo de la máquina.
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

      <MachineDetails dataMaquina={maquina} />
      <PlanDetails dataPlan={iniciados} />

      {activeStep === 1 && (
        <Card className="mt-2">
          <CardHeader className="pb-2">
            <CardTitle className="ms-2">QR de la Máquina</CardTitle>
            <CardDescription className="ms-2">
              Escanea el código de la máquina
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QrScannerComponent onScanSuccess={handleScanMaquina} />
          </CardContent>
        </Card>
      )}

      {activeStep === 2 && (
        <Card className="mt-2">
          <CardHeader className="pb-2">
            <CardTitle className="ms-2">Cantidad del Plan Activo</CardTitle>
            <CardDescription className="ms-2">
              Ingresa la cantidad que muestra la máquina
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input />
          </CardContent>
        </Card>
      )}

      {activeStep === 3 && (
        <Table className="bg-white mt-2 rounded-lg">
          <TableCaption>Lista de artículos asignados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Artículo</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asignadosMaquina.map((asignado) => (
              <Button
                key={asignado.NumeroPlan}
                className="bg-transparent text-black"
                onClick={() => handleAccion(asignado)}
              >
                <TableRow>
                  <TableCell className="font-medium">{asignado.FullCode}</TableCell>
                  <TableCell>{asignado.DescDetalle}</TableCell>
                  <TableCell>{asignado.Iniciado ? "Iniciado" : "Pendiente"}</TableCell>
                </TableRow>
              </Button>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
