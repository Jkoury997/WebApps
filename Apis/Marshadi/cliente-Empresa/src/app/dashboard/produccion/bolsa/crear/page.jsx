"use client";
import { useState, useRef } from "react";
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
import { Alert } from "@/components/ui/alert";
import { StepIndicator } from "@/components/component/step-indicartor";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArticleDetails } from "@/components/ui/articules-details";
import QrPrinter from "@/components/component/print/qr";

import { formatDateArgentina } from "@/utils/dates";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [maquina, setMaquina] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [pendientes, setPendientes] = useState([]);
  const [pendiente, setPendiente] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [qrData, setQrData] = useState(null);

  const [primera, setPrimera] = useState("");
  const [segunda, setSegunda] = useState("");
  const [descarte, setDescarte] = useState("");

  const isFormComplete = maquina.length > 0;
  const isStep3FormComplete =
    primera.length > 0 && segunda.length > 0 && descarte.length > 0;

  const handleInputChange = (e) => {
    setMaquina(e.target.value);
  };

  const handlePrimeraChange = (e) => {
    setPrimera(e.target.value);
  };

  const handleSegundaChange = (e) => {
    setSegunda(e.target.value);
  };

  const handleDescarteChange = (e) => {
    setDescarte(e.target.value);
  };

  const handleSubmit = async () => {
    if (!isFormComplete || loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/zyra/medias/pendientesmaquina?CodMaquina=${maquina.trim()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.error || result.Estado === false) {
        setAlertMessage({
          type: "error",
          message:
            result.mensaje ||
            result.Mensaje ||
            "Ocurrió un error al procesar la solicitud.",
        });
      } else if (!result.Pendientes || result.Pendientes.length === 0) {
        setAlertMessage({
          type: "error",
          message:
            result.Mensaje || "No hay pendientes para esta máquina.",
        });
      } else {
        setAlertMessage(null);
        setPendientes(result.Pendientes);
        setActiveStep(2);
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage({
        type: "error",
        message: error.message || "Hubo un error al enviar los datos.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar acciones en la tabla
  const handleAccion = (pendiente) => {
    setPendiente(pendiente);
    setActiveStep(3);
  };

  const handleStep3Submit = async () => {
    if (!isStep3FormComplete || loading) return;

    setLoading(true);

    try {
      // Preparar los datos para enviar
      const data = {
        CodMaquina: maquina.trim(),
        IdArticulo: pendiente.IdArticulo,
        CodPersonal: pendiente.CodPersonal.trim(),
        ContadoPrimera: Number(primera),
        ContadoSegunda: Number(segunda),
        ContadoDescarte: Number(descarte),

      };

      // Enviar los datos a la API
      const response = await fetch("/api/zyra/medias/contartejido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const result = await response.json();


      if (result.error || result.Estado === false) {
        setAlertMessage({
          type: "error",
          message:
            result.mensaje ||
            result.Mensaje ||
            "Ocurrió un error al procesar la solicitud.",
        });
      } else {
        setAlertMessage({
          type: "success",
          message: "Bolsa creada exitosamente.",
        });

        const qrObject = {
          IdArticulo: result.Bolsas[0].IdArticulo,
          Articulo: result.Bolsas[0].Articulo.trim(),
          Cantidad: result.Bolsas[0].Cantidad,
          Segunda: result.Bolsas[0].Segunda,
          IdBolsa: result.Bolsas[0].IdBolsa,
          Fecha: await formatDateArgentina()
        };

        // Convertir el objeto a cadena JSON
        setQrData(JSON.stringify(qrObject));
        setActiveStep(4);

        // Limpiar los campos
        setPrimera("");
        setSegunda("");
        setDescarte("");
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage({
        type: "error",
        message: error.message || "Hubo un error al enviar los datos.",
      });
    } finally {
      setLoading(false);
    }
  };



  const handleReset = () => {
    setActiveStep(1);
    setPendiente(null);
    setPendientes([]);
    setMaquina("");
    setPrimera("");
    setSegunda("");
    setDescarte("");
    setQrData(null);
  };

  return (
    <>
      <div className="mb-3 flex flex-col items-center">
        <StepIndicator activeStep={activeStep} steps={4} />
      </div>

      <div className="mb-2 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 text-center">Crear Bolsa</h1>
        <p className="text-muted-foreground text-center">
          Utiliza este formulario para crear una nueva Bolsa.
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
                <CardHeader>
              <CardTitle className="ms-2">Selecione la maquina</CardTitle>
              <CardDescription className="ms-2"
              >en este formuladio debe colocar el numero de maquina</CardDescription>
            </CardHeader>
          <CardContent>

          <div className="w-full  text-left p-2">
                <Label>Numero de Maquina</Label>
              </div>

              <Input
                placeholder="Introducir el número de máquina"
                type="number"
                value={maquina}
                onChange={handleInputChange}
                min="1"
                disabled={loading}
              />
              <Button
                type="button"
                className="w-full mt-3"
                disabled={!isFormComplete || loading}
                onClick={handleSubmit}
              >
                {loading ? "Cargando..." : "Cargar"}
              </Button>
          </CardContent>
        </Card>
      )}

      {activeStep === 2 && (
        <Table className="bg-white mt-2 rounded-lg">
          <TableCaption>Lista de artículos pendientes.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Artículo</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendientes.map((pendiente) => (
              <TableRow key={pendiente.NumeroPlan}>
                <TableCell className="font-medium">
                  {pendiente.FullCode}
                </TableCell>
                <TableCell>{pendiente.DescDetalle}</TableCell>
                <TableCell className="text-right">
                  <Button onClick={() => handleAccion(pendiente)}>
                    Crear
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {activeStep === 3 && pendiente && (
        <>
          <ArticleDetails dataArticulo={pendiente} />
          <Card className="mt-2">
            <CardHeader className="pb-2">
              <CardTitle>Ingresar</CardTitle>
              <CardDescription>Cantidad de tubos</CardDescription>
            </CardHeader>
            <CardContent className="m-0">
              <div className="w-full text-left">
                <Label>Primera - DOCENAS</Label>
              </div>
              <Input
                placeholder="Introducir la cantidad de primera en DOCENAS"
                type="number"
                value={primera}
                onChange={handlePrimeraChange}
                min="0"
                disabled={loading}
              />
              <div className="w-full text-left mt-2">
                <Label>Segunda - TUBOS</Label>
              </div>
              <Input
                placeholder="Introducir la cantidad de segunda en TUBOS"
                type="number"
                value={segunda}
                onChange={handleSegundaChange}
                min="0"
                disabled={loading}
              />
              <div className="w-full text-left mt-2">
                <Label>Descarte - TUBOS</Label>
              </div>
              <Input
                placeholder="Introducir la cantidad de descarte en TUBOS"
                type="number"
                value={descarte}
                onChange={handleDescarteChange}
                min="0"
                disabled={loading}
                className="mb-3"
              />

              <Button
                type="button"
                className="w-full"
                disabled={!isStep3FormComplete || loading}
                onClick={handleStep3Submit}
              >
                {loading ? "Cargando..." : "Crear Bolsa"}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

{activeStep === 4 && (
  <div className="flex flex-col items-center mt-3">
    {/* Utiliza el componente QrPrinter */}
    {qrData && (
      <QrPrinter qrData={qrData} />
    )}

    {/* Botón para crear otra bolsa */}
    <Button type="button" onClick={handleReset} className="mt-4">
      Crear otra bolsa
    </Button>
  </div>
)}


    </>
  );
}
