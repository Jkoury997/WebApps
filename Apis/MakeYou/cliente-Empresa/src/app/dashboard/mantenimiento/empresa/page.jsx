"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { EditIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function EmpresaList() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de fetch de datos desde una API
    const fetchEmpresas = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/manitas/empresa/listar"); // Reemplaza con tu endpoint real
        const data = await response.json();
        console.log(data);
        setEmpresas(data);
      } catch {
        console.log("Error");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
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
      {/* Botón para Crear Nueva Empresa */}
      <div className="flex justify-end mb-4">
        <Link href="/dashboard/mantenimiento/empresa/crear">
          <Button variant="default">Crear Nueva Empresa</Button>
        </Link>
      </div>

      {/* Tabla de Empresas */}
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
          {empresas.length > 0 ? (
            empresas.map((empresa) => (
              <TableRow key={empresa._id}>
                <TableCell className="hidden">{empresa._id}</TableCell>
                <TableCell>{empresa.nombre}</TableCell>
                <TableCell>{empresa.direccion}</TableCell>
                <TableCell>{empresa.telefono}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => alert(`Editar ${empresa.nombre}`)}>
                    <EditIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No hay empresas creadas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
