"use client";
import React, { forwardRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const OrdenAImprimir = forwardRef(({ firma, despacho, productos, empresa, proveedor }, ref) => {
  return (
    <>
      <div ref={ref}>
        {/* Encabezado que se repetirá en cada página */}
        <div className="print-header">
          <Card className="w-full max-w-4xl mx-auto print:shadow-none">
            <CardHeader className="text-center border-b">
              <CardTitle className="text-2xl font-bold">
                Orden de Despacho
              </CardTitle>
              <p className="text-sm text-muted-foreground">{empresa.nombre}</p>
              <p className="text-sm text-muted-foreground">{empresa.direccion}</p>
            </CardHeader>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="print-content">
          {/* Sección de proveedor y Detalles */}
          <Card className="w-full max-w-4xl mx-auto print:shadow-none">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Proveedor:</h3>
                  <p>{proveedor.Nombre || " "}</p>
                  <p>{proveedor.Direccion || " "}</p>
                  <p>{proveedor.Cuit || " "}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold">Detalles de la orden:</h3>
                  <p>Orden #: {despacho.Numero}</p>
                  <p>Fecha: {new Date().toLocaleDateString()}</p>
                  <p>Almacén: {despacho.Almacen}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de productos */}
          <Card className="w-full max-w-4xl mx-auto print:shadow-none">
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Codigo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Retira</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productos.map((producto, index) => (
                    <TableRow key={index}>
                      <TableCell>{producto.Codigo}</TableCell>
                      <TableCell>{producto.Descripcion}</TableCell>
                      <TableCell className="text-right">{producto.Retira}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Pie de página que se repetirá en cada página */}
        <div className="print-footer">
          <Card className="w-full max-w-4xl mx-auto print:shadow-none">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Nota:</h3>
                  <p className="text-sm">
                    Entregado a las{" "}
                    {new Date().toLocaleString("es-AR", {
                      timeZone: "America/Argentina/Buenos_Aires",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Firma de Recepción:</h3>
                  {firma ? (
                    <img
                      src={firma}
                      alt="Firma de Recepción"
                      className="mt-4"
                      style={{ maxHeight: "80px" }}
                    />
                  ) : (
                    <div className="mt-4 border-b border-dashed border-gray-400 pt-8"></div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reglas CSS para impresión */}
      <style jsx global>{`
        @media print {
          /* Asegura que los colores se impriman correctamente */
          body {
            -webkit-print-color-adjust: exact;
          }
          /* Encabezado fijo */
          .print-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 150px; /* Ajusta según tu diseño */
          }
          /* Pie fijo */
          .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 180px; /* Ajusta según tu diseño */
          }
          /* Contenido con márgenes para evitar superposición */
          .print-content {
            margin-top: 160px; /* Espacio para el encabezado */
            margin-bottom: 110px; /* Espacio para el pie */
          }
        }
      `}</style>
    </>
  );
});

export default OrdenAImprimir;
