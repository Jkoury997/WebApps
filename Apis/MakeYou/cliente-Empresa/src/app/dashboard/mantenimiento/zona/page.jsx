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
  const [zonas, setZonas] = useState([]); // 🔹 Se inicializa como un array vacío
  const router = useRouter();

  // Cargar zonas cuando cambie la zona en la URL
  useEffect(() => {

    const fetchZonas = async () => {
      try {
        const response = await fetch(`/api/mantenimiento/zona/list`);

        if (!response.ok) {
          throw new Error("Error al obtener las zonas");
        }

        const data = await response.json();
        console.log("Zonas Cargadas:", data);
        setZonas(data.zonas); // 🔹 Usa el nombre correcto de la respuesta de la API
      } catch (error) {
        console.error("Error al cargar zonas:", error);
      }
    };

    fetchZonas();
  }, []); // 🔹 Se ejecuta cuando cambia `zona`

  // Filtrar zonas según la búsqueda
  const filteredZonas = zonas.filter((zona) =>
    zona.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Zonas</CardTitle>
          <CardDescription>Administra las zonas de tu empresa.</CardDescription>
        </div>
        <Button size="sm" onClick={() => router.push(`/dashboard/mantenimiento/zona/crear`)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva zona
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar zona..."
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
                <TableHead>Despliegues</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredZonas.length > 0 ? (
                filteredZonas.map((zona) => (
                  <TableRow key={zona._id}>
                    <TableCell className="font-medium">{zona.nombre}</TableCell>
                    <TableCell>
                      <Badge variant={zona.status === "active" ? "default" : "secondary"}>
                        {zona.zonas ? zona.zonas.length : 0}
                      </Badge>
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/mantenimiento/tareas?zona=${zona._id}`)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span>Ver Tareas</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Editar zona</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Eliminar zona</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron zonas.
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
