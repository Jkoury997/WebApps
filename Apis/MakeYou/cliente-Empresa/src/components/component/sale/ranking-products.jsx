"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function RankingProducts({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>15 Artículos Más Vendidos</CardTitle>
        <CardDescription>Productos con mayor volumen de ventas</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Art</TableHead>
                <TableHead>Desc</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((producto) => (
                <TableRow key={producto.Codigo.trim()}>
                  <TableCell className="font-medium">{producto.Codigo.trim()}</TableCell>
                  <TableCell>{producto.Descripcion}</TableCell>
                  <TableCell className="text-right">{producto.Cantidad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 text-center">No hay datos disponibles.</p>
        )}
      </CardContent>
    </Card>
  );
}
