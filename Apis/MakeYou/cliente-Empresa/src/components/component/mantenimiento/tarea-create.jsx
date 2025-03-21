"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const categories = [
  "Mantenimiento Preventivo",
  "Mantenimiento Correctivo",
  "Instalación",
  "Inspección",
  "Configuración",
];

export default function TaskCreationWithImage({ isSubmitting, isSuccess, onCreateTask }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    ubicacionExpecifica: "",
    //prioridad: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("La imagen es demasiado grande. El tamaño máximo es 10MB.");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert("Por favor ingresa un nombre");
      return;
    }

    if (!formData.ubicacionExpecifica.trim()) {
      alert("Por favor ingresa una ubicación específica");
      return;
    }

    if (!formData.descripcion.trim()) {
      alert("Por favor ingresa una descripción");
      return;
    }

    if (!formData.categoria) {
      alert("Por favor selecciona una categoría");
      return;
    }

    if (!imageFile) {
      alert("Por favor sube una imagen como evidencia");
      return;
    }

    if (onCreateTask) {
      onCreateTask(formData, imageFile);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 sm:px-6">
      <div className="flex items-center mb-6">
        <Link href="/tasks" className="mr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Crear Nueva Tarea</h1>
          <p className="text-muted-foreground">Completa el formulario y sube una imagen como evidencia</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">



              <div>
                <h2 className="text-lg font-semibold mb-4">Información de la Tarea</h2>
                <div className="grid gap-4">
                <div className="grid gap-2">
                      <Label htmlFor="nombre">Nombre <span className="text-destructive">*</span></Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        placeholder="Ej. Revision de artefectos"
                        value={formData.nombre}
                        onChange={handleInputChange}
                      />
                    </div>
                  <div className="grid gap-2">
                    <Label htmlFor="descripcion">
                      Descripción <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="descripcion"
                      name="descripcion"
                      placeholder="Ej. Revisión de equipos"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      className="resize-none"
                      required
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="categoria">
                        Categoría <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.categoria}
                        onValueChange={(value) => handleSelectChange("categoria", value)}
                        required
                      >
                        <SelectTrigger id="categoria">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="ubicacionExpecifica">Ubicacion expecifica <span className="text-destructive">*</span></Label>
                      <Input
                        id="ubicacionExpecifica"
                        name="ubicacionExpecifica"
                        placeholder="Ej. Luz fondo lado derecho"
                        value={formData.ubicacionExpecifica}
                        onChange={handleInputChange}
                        
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="prioridad">Prioridad (Construccion)</Label>
                      <Select
                        value={formData.prioridad}
                        onValueChange={(value) => handleSelectChange("prioridad", value)}
                        disabled
                      >
                        <SelectTrigger id="prioridad">
                          <SelectValue placeholder="Selecciona la prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Media">Media</SelectItem>
                          <SelectItem value="Baja">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
              <div>
                <h2 className="text-lg font-semibold mb-4">Evidencia</h2>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>
                      Imagen de Evidencia <span className="text-destructive">*</span>
                    </Label>

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />

                    {!imagePreview ? (
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                        }`}
                        onClick={handleUploadClick}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 rounded-full bg-muted">
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="font-medium">Haz clic para subir o arrastra y suelta</p>
                            <p className="text-sm text-muted-foreground mt-1">PNG, JPG o JPEG (máx. 10MB)</p>
                          </div>
                          <Button type="button" variant="secondary" className="mt-2" onClick={handleUploadClick}>
                            <Upload className="mr-2 h-4 w-4" />
                            Seleccionar Archivo
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative border rounded-lg overflow-hidden">
                        <div className="aspect-video relative">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Vista previa"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      Sube una imagen clara que muestre el estado o la situación actual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <Link href="/tasks">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting || isSuccess} className="min-w-[120px]">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      ¡Creada!
                    </>
                  ) : (
                    "Crear Tarea"
                  )}
                </Button>
              </div>
            </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
