import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  CreditCardIcon,
  BanknoteIcon,
  DollarSignIcon,
  CreditCard,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CajasReport({ dataCaja }) {
  const [isOpen, setIsOpen] = useState(false);
  // Ejemplo de datos recibidos

  const cajaData = dataCaja;

  if (!cajaData || Object.keys(cajaData).length === 0) {
    return <p>No hay datos disponibles.</p>;
  }
  // Arrays separados para puntos, tarjetas y efectivo/banco
  const puntos = [
    { nombre: "Punto 1", valor: cajaData.Punto1, icon: CreditCardIcon },
    { nombre: "Punto 2", valor: cajaData.Punto2, icon: CreditCardIcon },
  ];

  const tarjetas = [
    { nombre: "Tarjeta 01", valor: cajaData.Tarjeta01, icon: CreditCardIcon },
    { nombre: "Tarjeta 02", valor: cajaData.Tarjeta02, icon: CreditCardIcon },
    { nombre: "Tarjeta 03", valor: cajaData.Tarjeta03, icon: CreditCardIcon },
    { nombre: "Tarjeta 06", valor: cajaData.Tarjeta06, icon: CreditCardIcon },
    { nombre: "Tarjeta 12", valor: cajaData.Tarjeta12, icon: CreditCardIcon },
  ];

  // Calcular total de tarjetas
  const totalTarjetas =
    cajaData.Tarjeta01 +
    cajaData.Tarjeta02 +
    cajaData.Tarjeta03 +
    cajaData.Tarjeta06 +
    cajaData.Tarjeta12;

  const efectivoBanco = [
    { nombre: "Efectivo", valor: cajaData.Efectivo, icon: DollarSignIcon },
    { nombre: "Bancos", valor: cajaData.Bancos, icon: BanknoteIcon },
  ];

  const Pesos = (numero) => {
    if (isNaN(numero)) {
      return "N/A";
    }

    return numero.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2, // Para mostrar 2 decimales
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Formas de pago</CardTitle>
        <CardDescription>
          Conoce los porcentajes de cada método de pago.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Sección de Puntos */}
        <div className="mt-4">
          <div className="grid gap-4">
            {puntos.map((forma, index) => {
              const Icon = forma.icon;
              const porcentaje = ((forma.valor / cajaData.Total) * 100).toFixed(
                2
              ); // Cálculo del porcentaje

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-6 w-6" />
                    <span>{forma.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{porcentaje}%</span>
                    <span>{Pesos(forma.valor)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Línea divisoria */}
        <hr className="my-4 border-t-2" />

        {/* Sección de Efectivo y Banco */}
        <div className="mt-4">
          <div className="grid gap-4">
            {efectivoBanco.map((forma, index) => {
              const Icon = forma.icon;
              const porcentaje = ((forma.valor / cajaData.Total) * 100).toFixed(
                2
              ); // Cálculo del porcentaje

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-6 w-6" />
                    <span>{forma.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{porcentaje}%</span>
                    <span>{Pesos(forma.valor)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sección de Tarjetas */}

        {/* Collapsible para las tarjetas */}
        <div className="mt-4">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer hover:bg-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CreditCardIcon className="h-6 w-6" />
                  <span>Tarjetas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{((totalTarjetas / cajaData.Total) * 100).toFixed(
                2
              )}%</span>
                  <span>{Pesos(totalTarjetas)}</span>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-2 bg-gray-50 rounded-sm">
                <div className="grid gap-4">
                  {tarjetas.map((forma, index) => {
                    const Icon = forma.icon;
                    const porcentaje = (
                      (forma.valor / totalTarjetas) *
                      100
                    ).toFixed(2); // Cálculo del porcentaje

                    return (
                      <TooltipProvider>
                        <Tooltip>
                          {/* Trigger del Tooltip */}
                          <TooltipTrigger asChild>
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <>
                                {/* Icono y nombre del método de pago */}
                                <div className="flex items-center gap-2 cursor-pointer">
                                  <Icon className="h-6 w-6" />
                                  <span>{forma.nombre}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {porcentaje}%
                                  </span>
                                </div>
                              </>
                            </div>
                          </TooltipTrigger>
                          {/* Valor en pesos dentro de TooltipContent */}
                          <TooltipContent>
                            {Pesos(forma.valor)}{" "}
                            {/* Mostrar el valor en pesos formateado */}
                          </TooltipContent>
                          {/* Porcentaje de la forma de pago */}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}
