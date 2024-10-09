"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { EditIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function Page() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de fetch de datos desde una API
    const fetchCategorias = async () => {
      setLoading(true);
      try{
        const response = await fetch("/api/manitas/categoria/listar"); // Reemplaza con tu endpoint real
        const data = await response.json();
        console.log(data)
        setCategorias(data);
        
      }catch {
        console.log("Error")
      }finally{
        setLoading(false);
      }
      
    };

    fetchCategorias();
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
        <Link href="/dashboard/mantenimiento/categorias/crear">
        <Button variant="default" >
          Crear categoria
        </Button>
        </Link>
      </div>

      {/* Tabla de Lugares */}
      <Table className="bg-white">
        <TableHeader>
          <TableRow>
          <TableCell className="hidden">Id</TableCell>
            <TableCell>Titulo</TableCell>
            <TableCell>Descripcion</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
        {categorias.length > 0 ? (
          categorias.map((categoria) => (
            <TableRow key={categoria._id}>
            <TableCell className="hidden">{categoria._id}</TableCell>
              <TableCell>{categoria.titulo}</TableCell>
              <TableCell>{categoria.descripcion}</TableCell>
              <TableCell>
                <Link href={`/dashboard/mantenimiento/categorias/${categoria._id}`}>
                <Button variant="outline" >
                  <EditIcon className="h-4 w-4" />
                </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
          <TableCell colSpan={5} className="text-center py-4">
            No hay categorias creadas
          </TableCell>
        </TableRow>
        )}
        </TableBody>
      </Table>
    </div>
  );
}
