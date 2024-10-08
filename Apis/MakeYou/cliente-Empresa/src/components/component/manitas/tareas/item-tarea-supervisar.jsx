import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Info, Check, MapPin, Image as ImageIcon, ListTodoIcon, Tag, FileText, Calendar } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS;

export default function ItemTareaSupervisar({ tarea, handleSupervision, handleCompletion }) {
  const [comentario, setComentario] = useState("");
  const [imagen, setImagen] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [realizadaCorrectamente, setRealizadaCorrectamente] = useState(null); // Estado para la selección de "Sí" o "No"

  // Manejar la selección de imagen
  const handleImageChange = (file) => {
    setImagen(file);
  };

  // Manejar la supervisión dependiendo de si fue realizada correctamente o no
  const handleSubmitSupervision = async (e) => {
    e.preventDefault();
    if (realizadaCorrectamente === "si") {
      // Marcar tarea como completada y supervisada
      await handleCompletion(tarea._id);
    } else {
      // Guardar el comentario y la imagen si no fue realizada correctamente
      await handleSupervision(tarea._id, comentario, imagen);
    }
    setIsDialogOpen(false);
  };

  const getUrgenciaColor = (urgencia) => {
    switch (urgencia) {
      case "baja":
        return "bg-green-500";
      case "media":
        return "bg-yellow-500";
      case "alta":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="w-full mb-4 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${getUrgenciaColor(tarea.urgencia || 'default')}`} />
            <h3 className={`text-lg font-semibold ${tarea.supervisada ? "line-through text-muted-foreground" : ""}`}>
              {tarea.titulo || 'Sin título'}
            </h3>
          </div>
           
          {/* Botones para mostrar detalles y supervisar */}
          <div className="flex space-x-2">
             {/* Ver detalles */}
             <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Info className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{tarea.titulo || 'Sin título'}</DialogTitle>
                </DialogHeader>
                <TaskDetails tarea={tarea} />
              </DialogContent>
            </Dialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                
                <Button variant="outline" size="icon" disabled={tarea.supervisada}>
                  {tarea.supervisada ? <Check className="w-4 h-4" /> : <ListTodoIcon className="w-4 h-4" />}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Supervisar Tarea</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitSupervision}>
                  <div className="grid gap-4 py-4">
                    <Label>¿La tarea se realizó correctamente?</Label>
                    <div className="flex space-x-2">
                      <Button variant={realizadaCorrectamente === "si" ? "solid" : "outline"} onClick={() => setRealizadaCorrectamente("si")}>Sí</Button>
                      <Button variant={realizadaCorrectamente === "no" ? "solid" : "outline"} onClick={() => setRealizadaCorrectamente("no")}>No</Button>
                    </div>

                    {realizadaCorrectamente === "no" && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="image">Subir imagen de la tarea supervisada:</Label>
                          <Input id="image" type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files[0])} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="comentario">Comentario de supervisión:</Label>
                          <Textarea
                            id="comentario"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Escribe un comentario sobre la supervisión..."
                            rows={4}
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Confirmar Supervisión
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 bg-secondary">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            {tarea.lugar.nombre || 'Lugar no especificado'}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <ImageIcon className="w-4 h-4 mr-1" />
            {tarea.imagenAntes && tarea.imagenDespues ? 'Antes y Después' : tarea.imagenAntes ? 'Solo Antes' : tarea.imagenDespues ? 'Solo Después' : 'Sin imágenes'}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

// Componentes auxiliares

function TaskDetails({ tarea }) {
  return (
    <div className="grid gap-4 py-4">
      <DetailItem icon={<Check />} label="Estado:" value={tarea.supervisada ? "Supervisada" : "Pendiente de supervisión"} />
      <DetailItem icon={<MapPin />} label="Lugar:" value={tarea.lugar.nombre || 'No especificado'} />
      <DetailItem icon={<Tag />} label="Categoría:" value={tarea.categoria.titulo || 'No especificada'} />
      <DetailItem icon={<FileText />} label="Descripción:" value={tarea.descripcion || 'Sin descripción'} />
      <DetailItem icon={<Calendar />} label="Fecha de creación:" value={tarea.fechaCreada ? new Date(tarea.fechaCreada).toLocaleDateString() : 'Fecha no disponible'} />

      {/* Mostrar imágenes antes y después */}
      <div className="grid grid-cols-2 gap-4">
        {tarea.imagenAntes && (
          <div className="mt-2">
            <Label className="font-semibold">Imagen antes:</Label>
            <Image
              src={`${NEXT_PUBLIC_URL_API_MANITAS}/uploads/${tarea.imagenAntes}`}
              alt="Tarea antes"
              width={300}
              height={200}
              className="rounded-md object-cover"
            />
          </div>
        )}
        {tarea.imagenDespues && (
          <div className="mt-2">
            <Label className="font-semibold">Imagen después:</Label>
            <Image
              src={`${NEXT_PUBLIC_URL_API_MANITAS}/uploads/${tarea.imagenDespues}`}
              alt="Tarea después"
              width={300}
              height={200}
              className="rounded-md object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <Label className="font-semibold">{label}</Label>
      <span>{value}</span>
    </div>
  );
}
