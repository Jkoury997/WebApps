'use client'

import { useState } from 'react'
import FiltroTareas from "@/components/component/manitas/filter/filter-task"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Info, CheckSquare, MapPin, Tag, User, Calendar, AlertTriangle, UserCheck, UserCog } from "lucide-react"
import Image from 'next/image'

const urgenciaColor = {
  baja: 'bg-green-100 text-green-800',
  media: 'bg-yellow-100 text-yellow-800',
  alta: 'bg-red-100 text-red-800'
}

const estadoTarea = {
  pendiente: { color: 'bg-blue-100 text-blue-800', texto: 'Pendiente' },
  completada: { color: 'bg-green-100 text-green-800', texto: 'Completada' },
  supervisada: { color: 'bg-purple-100 text-purple-800', texto: 'Supervisada' }
}

const TaskList = ({ tareasIniciales }) => {
  const [tareas, setTareas] = useState(tareasIniciales)

  // Estados para los filtros
  const [filtroLugar, setFiltroLugar] = useState("")
  const [filtroUrgencia, setFiltroUrgencia] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("")

  const completarTarea = (id) => {
    setTareas(tareas.map(tarea => 
      tarea._id === id ? { ...tarea, completada: true, fechaCompletada: new Date() } : tarea
    ))
  }

  const getEstadoTarea = (tarea) => {
    if (tarea.supervisada) return estadoTarea.supervisada
    if (tarea.completada) return estadoTarea.completada
    return estadoTarea.pendiente
  }

  // Extrae las opciones únicas para los filtros
  const lugaresUnicos = [...new Set(tareas.map(tarea => tarea.lugar?.nombre).filter(Boolean))]
  const categoriasUnicas = [...new Set(tareas.map(tarea => tarea.categoria?.titulo).filter(Boolean))]

  // Función para limpiar los filtros
  const handleLimpiarFiltros = () => {
    setFiltroLugar("")
    setFiltroUrgencia("")
    setFiltroCategoria("")
  }

  // Filtrar tareas según los filtros seleccionados
  const tareasFiltradas = tareas.filter(tarea => {
    const cumpleLugar = filtroLugar ? tarea.lugar?.nombre === filtroLugar : true
    const cumpleUrgencia = filtroUrgencia ? tarea.urgencia === filtroUrgencia : true
    const cumpleCategoria = filtroCategoria ? tarea.categoria?.titulo === filtroCategoria : true
    return cumpleLugar && cumpleUrgencia && cumpleCategoria
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Lista de Tareas</h1>

      {/* Componente de Filtros */}
      <FiltroTareas
  lugares={lugaresUnicos}
  categorias={categoriasUnicas}
  onFiltrarLugar={setFiltroLugar}
  onFiltrarUrgencia={setFiltroUrgencia}
  onFiltrarCategoria={setFiltroCategoria}
  onLimpiarFiltros={handleLimpiarFiltros}
  filtroLugar={filtroLugar}         // Pasa el valor del filtroLugar
  filtroUrgencia={filtroUrgencia}   // Pasa el valor del filtroUrgencia
  filtroCategoria={filtroCategoria} // Pasa el valor del filtroCategoria
/>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tareasFiltradas.map((tarea) => {
          const estadoActual = getEstadoTarea(tarea)
          return (
            <Card key={tarea._id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">{tarea.titulo}</CardTitle>
                  <Badge className={urgenciaColor[tarea.urgencia]}>
                    {tarea.urgencia.charAt(0).toUpperCase() + tarea.urgencia.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center">
                    <Badge className={estadoActual.color}>
                      {estadoActual.texto}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    <span>{tarea.categoria?.titulo}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{tarea.lugar?.nombre || "Sin lugar"}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{tarea.creadoPor}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(tarea.fechaCreada).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Info className="w-4 h-4" />
                      Detalles
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                      <DialogTitle>{tarea.titulo}</DialogTitle>
                    </DialogHeader>
                    {/* Tabs con contenido de la tarea */}
                    <Tabs defaultValue="info" className="flex-grow overflow-hidden">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="info">Información</TabsTrigger>
                        <TabsTrigger value="images">Imágenes</TabsTrigger>
                        <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                      </TabsList>
                      <ScrollArea className="flex-grow">
                        {/* Contenido de información */}
                        <TabsContent value="info" className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center">
                              <Tag className="w-4 h-4 mr-2" />
                              <strong>Categoría:</strong> {tarea.categoria?.titulo}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <strong>Lugar:</strong> {tarea.lugar?.nombre || "Sin lugar"}
                            </div>
                            {/* Otros detalles */}
                          </div>
                        </TabsContent>
                        {/* Otros Tabs */}
                      </ScrollArea>
                    </Tabs>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => completarTarea(tarea._id)}
                  disabled={tarea.completada}
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  {tarea.completada ? "Completada" : "Completar"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default TaskList
