"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, MoreHorizontal, Plus, Search, ExternalLink, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ZoneList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tareas, setTareas] = useState([]); // 🔹 Se inicializa como un array vacío
  const [data, setData] = useState([]); // 🔹 Se inicializa como un array vacío
  const router = useRouter();
  const searchParams = useSearchParams();
  const zona = searchParams.get("zona");

  // Cargar tareas cuando cambie la zona en la URL
  useEffect(() => {
    if (!zona) return; // 🔹 Evita hacer la petición si zona es null

    const fetchTareas = async () => {
      try {
        const response = await fetch(`/api/mantenimiento/tarea/list?zona=${zona}`);

        if (!response.ok) {
          throw new Error("Error al obtener las tareas");
        }

        const data = await response.json();
        console.log("Tareas cargadas:", data);
        setData(data)
        setTareas(data.tareas); // 🔹 Usa el nombre correcto de la respuesta de la API
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };

    fetchTareas();
  }, [zona]); // 🔹 Se ejecuta cuando cambia `zona`

  // Filtrar tareas según la búsqueda
  const filteredTareas = tareas.filter((tarea) =>
    tarea.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tarea.categoria.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tareas de {data.nombre}</CardTitle>
          <CardDescription>Administra las tareas de tu zona.</CardDescription>
        </div>
        <Button size="sm" onClick={() => router.push(`/dashboard/mantenimiento/tareas/crear?zona=${zona}`)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarea..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    <span>Nombre</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Estado</TableHead>
                
                <TableHead >Fecha</TableHead>
                <TableHead >Prioridad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTareas.length > 0 ? (
                filteredTareas.map((tarea) => (
                  <TableRow key={tarea._id}>
                    <TableCell className="font-medium">{tarea.nombre}</TableCell>
                    <TableCell>
                      <Badge variant={tarea.status === "active" ? "default" : "secondary"}>
                        {tarea.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(tarea.tiempoInicio).toISOString().split("T")[0]}</TableCell>
                    <TableCell >Baja</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/mantenimiento/tarea/ver?tarea=${tarea._id}`)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span>Ver Tarea</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Editar tarea</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Eliminar tarea</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron tareas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
