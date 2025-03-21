"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export function SalesDetailTable({ stats, store }) {
  if (!stats) {
    return <p className="text-center text-gray-500">No hay datos disponibles</p>;
  }

  let filteredStores = [];

  if (store === "ZZZZZ") {
    // Filtrar tiendas con Bruto > 0 y excluir la tienda total "ZZZZZ"
    filteredStores = stats.filter((t) => t.CodTienda.trim() !== "ZZZZZ" && t.Bruto > 0);
  } else {
    // Buscar una tienda específica
    const storeData = stats.find((t) => t.CodTienda.trim() === store);
    if (storeData) {
      filteredStores = [storeData];
    }
  }

  if (filteredStores.length === 0) {
    return <p className="text-center text-gray-500">No se encontraron datos para la tienda seleccionada</p>;
  }

  // Obtener el total de ventas para calcular % del Total
  const totalData = stats.find((t) => t.CodTienda.trim() === "ZZZZZ");
  const totalVentas = totalData ? totalData.Bruto : 1; // Evitar división por 0

  return (
    <div className="mt-2">
    <Card>
      <CardHeader>
        <CardTitle>Detalle de Ventas por Tienda</CardTitle>
        <CardDescription>Desglose de ventas por tienda durante el período seleccionado</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tienda</TableHead>
              <TableHead>Ventas Totales</TableHead>
              <TableHead>CAT</TableHead>
              <TableHead>Ticket Promedio</TableHead>
              <TableHead className="text-right">% Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStores.map(({ CodTienda, Tienda, Bruto, CAT,TP }) => {
              const porcentajeTotal = (Bruto / totalVentas) * 100;

              return (
                <TableRow key={CodTienda.trim()}>
                  <TableCell className="font-medium">{Tienda}</TableCell>
                  <TableCell>${Bruto.toLocaleString("es-MX")}</TableCell>
                  <TableCell>{CAT.toLocaleString("es-MX")}</TableCell>
                  <TableCell>${TP.toLocaleString("es-MX")}</TableCell>
                  <TableCell className="text-right">{porcentajeTotal.toFixed(1)}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </div>
  );
}
