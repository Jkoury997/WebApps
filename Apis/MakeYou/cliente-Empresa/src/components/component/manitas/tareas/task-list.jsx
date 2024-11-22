'use client';

import { useState } from "react";
import FiltroTareas from "@/components/component/manitas/filter/filter-task";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Camera, Info, CheckSquare, Tag, MapPin, User, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import Image from "next/image"; // Componente de Next.js para imágenes

const urgenciaColor = {
  baja: "bg-green-100 text-green-800",
  media: "bg-yellow-100 text-yellow-800",
  alta: "bg-red-100 text-red-800",
};

const estadoTarea = {
  pendiente: { color: "bg-blue-100 text-blue-800", texto: "Pendiente" },
  completada: { color: "bg-green-100 text-green-800", texto: "Completada" },
  supervisada: { color: "bg-purple-100 text-purple-800", texto: "Supervisada" },
  pendienteSupervisar: { color: "bg-yellow-100 text-yellow-800", texto: "Pendiente de Supervisión" },
};

const TaskList = ({ tareasIniciales }) => {
  const [tareas, setTareas] = useState(tareasIniciales);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [nota, setNota] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 

  const handleCompleteTask = async (tareaId) => {


    try {
      const formData = new FormData();
      formData.append("nota", nota);
      formData.append("imagenDespues", image);

      console.log(formData)

      const response = await fetch(`/api/manitas/tareas/completar?tareaId=${tareaId}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const updatedTarea = await response.json();
        setTareas((prev) =>
          prev.map((tarea) => (tarea._id === updatedTarea._id ? updatedTarea : tarea))
        );
        setNota("");
        setImage(null);
        setImagePreview(null);
        setSelectedTarea(null);
        setIsDialogOpen(false); // Cerrar el dialog después de completar la tarea
        
      } else {
        console.error("Error al completar la tarea:", await response.text());
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } 
  };


  const handleCapturePhoto = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview); // Limpiar URL previa
    setImage(null);
    setImagePreview(null);
  };


  const getEstadoTarea = (tarea) => {
    if (tarea.supervisada) return estadoTarea.supervisada;
    if (tarea.completada) return estadoTarea.completada;
    return estadoTarea.pendiente;
  };

  const lugaresUnicos = [...new Set(tareas.map((tarea) => tarea.lugar?.nombre).filter(Boolean))];
  const categoriasUnicas = [
    ...new Set(tareas.map((tarea) => tarea.categoria?.titulo).filter(Boolean)),
  ];

  const tareasFiltradas = tareas; // Ajusta los filtros según tu lógica

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Lista de Tareas</h1>

      {/* Componente de Filtros */}
      <FiltroTareas
        lugares={lugaresUnicos}
        categorias={categoriasUnicas}
        onFiltrarLugar={() => {}}
        onFiltrarUrgencia={() => {}}
        onFiltrarCategoria={() => {}}
        onLimpiarFiltros={() => {}}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tareasFiltradas.map((tarea) => {
          const estadoActual = getEstadoTarea(tarea);
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
                  <Badge className={estadoActual.color}>{estadoActual.texto}</Badge>
                  <div>Lugar: {tarea.lugar?.nombre || "Sin lugar"}</div>
                  <div>Categoría: {tarea.categoria?.titulo}</div>
                  <div>Creado por: {tarea.creadoPor}</div>
                  <div>Fecha: {new Date(tarea.fechaCreada).toLocaleDateString()}</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Info className="w-4 h-4 mr-2" />
                      Detalles
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                      <DialogTitle>{tarea.titulo}</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="info" className="flex-grow overflow-hidden">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="info">Información</TabsTrigger>
                        <TabsTrigger value="images">Imágenes</TabsTrigger>
                        <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                      </TabsList>
                      <ScrollArea className="flex-grow p-4">
                        <TabsContent value="info">
                          <div className="grid gap-4">
                            <div><strong>Lugar:</strong> {tarea.lugar?.nombre || "Sin lugar"}</div>
                            <div><strong>Categoría:</strong> {tarea.categoria?.titulo}</div>
                            <div><strong>Creado por:</strong> {tarea.creadoPor}</div>
                            <div><strong>Fecha creada:</strong> {new Date(tarea.fechaCreada).toLocaleString()}</div>
                          </div>
                        </TabsContent>

                        <TabsContent value="descripcion">
                          <p>{tarea.descripcion || "No hay descripción disponible."}</p>
                        </TabsContent>
                      </ScrollArea>
                    </Tabs>
                  </DialogContent>
                </Dialog>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      disabled={tarea.completada}
                      onClick={() => setSelectedTarea(tarea)}
                    >
                      Completar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Completar Tarea</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
  <Label htmlFor="nota">Ingresar una descripción del trabajo</Label>
  <Input
    id="nota"
    placeholder="Ingresa una nota"
    value={nota}
    onChange={(e) => setNota(e.target.value)}
  />
  <div>
    <label
      htmlFor="camera-input"
      className="cursor-pointer flex items-center space-x-2"
    >
      <Camera className="w-5 h-5" />
      <span>{image ? "Cambiar foto" : "Tomar foto"}</span>
    </label>
    <input
      id="camera-input"
      type="file"
      accept="image/*"
      capture="environment"
      onChange={handleCapturePhoto}
      className="hidden"
    />
    {imagePreview && (
          <div className="flex flex-col items-center mt-4 space-y-2">
            <Image
              src={imagePreview}
              alt="Captura previa"
              width={300}
              height={300}
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              className="text-red-500 underline"
              onClick={handleRemoveImage}
            >
              Eliminar imagen
            </button>
          </div>
        )}
  </div>

                    <Button className="w-full"
                      onClick={() => handleCompleteTask(selectedTarea._id)}
                      disabled={!nota || !image}
                    >
                        Completar tarea
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
