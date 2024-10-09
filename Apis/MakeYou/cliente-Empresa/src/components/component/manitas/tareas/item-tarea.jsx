import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Info,
  Check,
  LogOut,
  MapPin,
  Tag,
  FileText,
  Calendar,
  ImageIcon,
} from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS;

export default function ItemTarea({ tarea, handleComplete }) {
  const [nota, setNota] = useState(""); // Estado para la nota
  const [imagen, setImagen] = useState(null); // Estado para la imagen
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  // Manejar el cambio de imagen
  const handleImageChange = (file) => {
    setImagen(file);
  };

  const handleSubmitComplete = async (nota, imagen) => {
    await handleComplete(tarea._id, nota, imagen);
    // Cerrar el diálogo después de completar la tarea
    setIsDialogOpen(false);
  };

  // Validar si la tarea no existe
  if (!tarea) {
    return (
      <Card className="w-full mb-4 hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-muted-foreground">
            <span>Error: Tarea no disponible</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mb-4 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Urgencia */}
            <div
              className={`w-4 h-4 rounded-full ${getUrgenciaColor(
                tarea.urgencia || "default"
              )}`}
            />
            {/* Título de la tarea */}
            <h3
              className={`text-lg font-semibold ${
                tarea.completada ? "line-through text-muted-foreground" : ""
              }`}
            >
              {tarea.titulo || "Sin título"}
            </h3>
          </div>

          {/* Botones para mostrar detalles y completar */}
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
                  <DialogTitle>{tarea.titulo || "Sin título"}</DialogTitle>
                </DialogHeader>
                <TaskDetails tarea={tarea} />
              </DialogContent>
            </Dialog>

            {/* Completar tarea */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={tarea.completada}
                >
                  {tarea.completada ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Completar Tarea</DialogTitle>
                </DialogHeader>
                <CompleteTaskForm
                  tareaId={tarea._id}
                  handleSubmit={handleSubmitComplete} // Ahora llamamos a handleSubmitComplete
                  setNota={setNota}
                  nota={nota}
                  handleImageChange={handleImageChange}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 bg-secondary">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            {tarea.lugar.nombre || "Lugar no especificado"}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <ImageIcon className="w-4 h-4 mr-1" />
            {tarea.imagenAntes && tarea.imagenDespues
              ? "Antes y Después"
              : tarea.imagenAntes
              ? "Solo Antes"
              : tarea.imagenDespues
              ? "Solo Después"
              : "Sin imágenes"}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

function CompleteTaskForm({
  tareaId,
  handleSubmit,
  setNota,
  nota,
  handleImageChange,
}) {
  const [imagePreview, setImagePreview] = useState(null); // Estado para la vista previa de la imagen

  const handleImageChangeInternal = (file) => {
    handleImageChange(file); // Llamada a la función para manejar la imagen en el componente padre
    setImagePreview(URL.createObjectURL(file)); // Generar la vista previa de la imagen
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        handleSubmit(nota, e.target.image.files[0]); // Enviar nota e imagen
      }}
    >
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="nota">Nota:</Label>

          <Textarea
            id="nota"
            value={nota}
            placeholder="Coloque un comentario."
            onChange={(e) => setNota(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="image">Subir imagen de la tarea completada:</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChangeInternal(e.target.files[0])}
            required
          />
        </div>

        {/* Mostrar la imagen de vista previa si existe */}
        {imagePreview && (
          <div className="mt-2 w-full max-w-[450px]">
            {" "}
            {/* Asegura que no exceda el tamaño máximo */}
            <Label className="font-semibold">Vista previa de la imagen:</Label>
            <AspectRatio ratio={16 / 9} className="relative">
              <Image
                src={imagePreview}
                alt="Vista previa"
                fill
                className="rounded-md h-full w-full object-contain mt-2"
              />
            </AspectRatio>
          </div>
        )}
      </div>
      <Button type="submit" className="w-full">
        Completar Tarea
      </Button>
    </form>
  );
}

function TaskDetails({ tarea }) {
  const images = [
    { src: tarea.imagenAntes, alt: "Trabajo a realizar" },
    { src: tarea.imagenDespues, alt: "Tarea terminada" },
    { src: tarea.imagenSupervision, alt: "Supervisión de tarea" },
  ].filter((img) => img.src);
  return (
    <div className="grid gap-4 py-4">
      <DetailItem
        icon={<Check />}
        label="Estado:"
        value={tarea.completada ? "Completada" : "Pendiente"}
      />
      <DetailItem
        icon={<MapPin />}
        label="Lugar:"
        value={tarea.lugar.nombre || "No especificado"}
      />
      <DetailItem
        icon={<Tag />}
        label="Categoría:"
        value={tarea.categoria.titulo || "No especificada"}
      />
      <DetailItem
        icon={<FileText />}
        label="Descripción:"
        value={tarea.descripcion || "Sin descripción"}
      />
      <DetailItem
        icon={<Calendar />}
        label="Fecha de creación:"
        value={
          tarea.fechaCreada
            ? new Date(tarea.fechaCreada).toLocaleDateString()
            : "Fecha no disponible"
        }
      />
  <div className="w-full max-w-sm mx-auto">
      <Carousel className="w-full" >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem  key={index}>
              <Label className="font-bold text-md">{image.alt}: </Label>
              <Card className="border-0 shadow-none">
                <CardContent className="flex aspect-square items-center justify-center p-2">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_URL_API_MANITAS}/uploads/${image.src}`}
                    alt={image.alt}
                    width={250}
                    height={250}
                    className="rounded-md object-cover w-full h-full"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
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
