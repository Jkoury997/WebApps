"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Wrench, Droplet, PaintBucket, Scissors, Zap, Truck, Hammer, TreePine, Plus } from "lucide-react"


export default function Page() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true); // Estado de carga
  const router = useRouter();

  useEffect(() => {
    fetchCategorias();
  }, []);



  const fetchCategorias = async () => {
    setLoading(true); // Activa el estado de carga
    try {
      const response = await fetch("/api/manitas/categorias/list");
      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData);
        
        setCategorias(responseData.categorias || []); 
      } else {
        console.error("Error en la respuesta de la API:", responseData);
      }
    } catch (error) {
      console.error("Error fetching tiendas:", error);
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };



  const handleCrearNueva = () => {
    // Aquí iría la lógica para crear una nueva categoría
    // Por ahora, solo mostraremos una alerta
    router.push("/dashboard/mantenimiento/categorias/crear")
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Categorías de Servicios</h2>
      <div className="border rounded-lg overflow-hidden">
        <Table className="bg-white">
          <TableHeader >
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">Descripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id} className="hover:bg-muted/50">

                <TableCell className="font-medium">{categoria.titulo}</TableCell>
                <TableCell className="hidden md:table-cell">{categoria.descripcion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleCrearNueva} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Crear nueva categoría
        </Button>
      </div>
    </div>
  )
}