"use client";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import OrdenAImprimir from "@/components/component/stock/despacho/orden-al-imprimir"; // Ajusta la ruta según tu estructura
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintOrden({ firma, despacho, productos, empresa, proveedor }) {
  const componentRef = useRef();

  return (
    <div>
      {/* Botón para disparar la impresión */}
      <div className="flex justify-center items-center mb-4">
        <ReactToPrint
          trigger={() => (
            <Button className="bg-blue-500 text-white">
              <Printer className="mr-2 h-4 w-4" /> Imprimir Orden
            </Button>
          )}
          content={() => componentRef.current}
          pageStyle="@media print { body { -webkit-print-color-adjust: exact; } }" // Opcional, para mejorar los estilos en impresión
        />
      </div>

      {/* Componente que se imprimirá */}
      <OrdenAImprimir
        ref={componentRef}
        firma={firma}
        despacho={despacho}
        productos={productos}
        empresa={empresa}
        proveedor={proveedor}
      />
    </div>
  );
}
