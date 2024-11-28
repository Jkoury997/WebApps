"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { EditIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function Page() {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de fetch de datos desde una API
    const fetchLugares = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/manitas/lugares/listar"); // Reemplaza con tu endpoint real
        const data = await response.json();
        setLugares(data.data);
      } catch {
        console.log("Error");
      } finally {
        setLoading(false);
      }
    };

    fetchLugares();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      {/* Botón para CREAR NUEVO LUGAR */}
      <div className="flex justify-end mb-4">
        <Link href="/dashboard/mantenimiento/lugares/crear">
          <Button variant="default">Crear Lugar</Button>
        </Link>
      </div>

      {/* Tabla de Lugares */}
      <Table className="bg-white">
        <TableHeader>
          <TableRow>
            <TableCell className="hidden">Id</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lugares.length > 0 ? (
            lugares.map((lugar) => (
              <TableRow key={lugar._id}>
                <TableCell className="hidden">{lugar._id}</TableCell>
                <TableCell>{lugar.nombre}</TableCell>
                <TableCell>{lugar.direccion}</TableCell>
                <TableCell>{lugar.telefono}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/mantenimiento/lugares/${lugar._id}`}>
                    <Button variant="outline">
                      <EditIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No hay lugares creados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
