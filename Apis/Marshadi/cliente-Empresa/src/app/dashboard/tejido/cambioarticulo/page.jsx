"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { Badge } from "@/components/ui/badge";
import { FileTextIcon } from "lucide-react";
import { CambioArticuloDetails } from "@/components/ui/details/cambio-articulo-details";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [maquina, setMaquina] = useState("");
  const [scanned, setScanned] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [asignadosMaquina, setAsignadosMaquinas] = useState([]);
  const [iniciados, setIniciados] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [cantidad, setCantidad] = useState(""); // Estado para almacenar la cantidad
  const [cantidadError, setCantidadError] = useState(null); // Estado para manejar errores de validación
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null); // Estado para almacenar el artículo seleccionado

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

        const asignados = await fetchAsignadosMaquina(result.Maquina.CodMaquina);
        const hasIniciado = asignados.some(
          (asignado) => asignado.Iniciado === true
        );
        setActiveStep(hasIniciado ? 2 : 3);
        setScanned(true);
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

  const handleAccion = (asignado) => {
    setArticuloSeleccionado(asignado); // Guardar el artículo seleccionado
    setActiveStep(4); // Cambiar al paso 4
  };

  const handleCantidadChange = (e) => {
    const value = e.target.value;

    // Verifica que el valor sea un número, no esté vacío, y no sea negativo
    if (!isNaN(value) && value !== "" && Number(value) >= 0) {
      setCantidad(value);
      setCantidadError(null); // Si el valor es válido, eliminamos el error
    } else if (Number(value) < 0) {
      setCantidadError("La cantidad no puede ser negativa."); // Si es negativo, mostramos un mensaje de error
    } else {
      setCantidadError("Por favor ingresa un número válido."); // Si no es un número válido, mostramos un mensaje de error
    }
  };

  // Función para enviar la solicitud a la API
  const handleSubmit = async () => {
    const requestData = {
      CodMaquina: maquina.CodMaquina.trim(),
      IdDocumento: articuloSeleccionado.IdDocumento,
      Producido: Number(cantidad),
    };
    try {
      const response = await fetch('/api/zyra/medias/cambiararticulotejido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

    

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.Mensaje);
      }
      console.log('Solicitud enviada exitosamente:', result);

      setAlertMessage({
        type: "success",
        message: result.Mensaje,
      });
    } catch (error) {
      console.error(error);
      setAlertMessage({
        type: "error",
        message: error.message,
      });
    }
  };

  const handleReset = () => {
    setActiveStep(1)
    setMaquina(false)
    setScanned(false)
    setAsignadosMaquinas([])
    setIniciados(null)
    setCantidad("")
    setCantidadError(null)
    setArticuloSeleccionado(null)
  }

  return (
    <>
      <div className="mb-3 flex flex-col items-center">
        <StepIndicator activeStep={activeStep} steps={4} />
      </div>

      <div className="mb-2 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Cambiar Articulo
        </h1>
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
      <PlanDetails dataPlan={iniciados} cantidad={cantidad} />
      <CambioArticuloDetails dataArticulo={articuloSeleccionado}/>
      

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
            <Input
              value={cantidad}
              onChange={handleCantidadChange}
              placeholder="Cantidad"
              type="number"
              required
            />
            {cantidadError && (
              <p className="text-red-500 mt-1">{cantidadError}</p>
            )}
            <div className="flex justify-end mt-4">
              <Button
                className="w-full sm:w-auto"
                onClick={() => setActiveStep(3)}
                disabled={!cantidad || cantidadError}
              >
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeStep === 3 && (
        <div className="overflow-x-auto bg-white mt-2 rounded-lg">
          <Table>
            <TableCaption>Lista de artículos asignados.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Artículo</TableHead>
                <TableHead className="hidden md:table-cell">Color</TableHead>
                <TableHead className="hidden md:table-cell">Estado</TableHead>
                <TableHead className="md:hidden">Detalles</TableHead>
                <TableHead className="text-center">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asignadosMaquina
                .filter((asignado) => asignado.Iniciado === false)
                .map((asignado) => (
                  <TableRow key={asignado.NumeroPlan}>
                    <TableCell className="font-medium">
                      {asignado.FullCode.split("-")[0]}-{asignado.DescMedida}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {asignado.DescDetalle}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {asignado.Iniciado ? "Iniciado" : "Pendiente"}
                    </TableCell>
                    <TableCell className="md:hidden">
                      <div className="text-sm text-gray-500">
                        <p className="text-black"> {asignado.DescDetalle}</p>
                        <p>{asignado.Iniciado ? "Iniciado" : "Pendiente"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button onClick={() => handleAccion(asignado)}>
                        Seleccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}

{activeStep === 4 && articuloSeleccionado && (
  <Card className="mt-4 w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle className="text-xl font-bold">Revisar todos los datos</CardTitle>
      <CardDescription>Este proceso terminara con el <span className="font-semibold">actual tejido</span> e iniciara con el <span className="font-semibold">nuevo tejido</span></CardDescription>
    </CardHeader>
    <CardContent>
      <Button className="w-full" onClick={handleSubmit}>
        Enviar Solicitud
      </Button>
      <Button className="w-full mt-3"  variant="secondary" onClick={() => {
    handleReset();
    setAlertMessage(null);
  }}>
        Volver a empezar
      </Button>
    </CardContent>
  </Card>
)}

    </>
  );
}
