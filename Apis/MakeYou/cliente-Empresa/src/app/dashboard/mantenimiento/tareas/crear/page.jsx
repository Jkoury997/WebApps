"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner"
import { useRouter } from "next/navigation";

import { Camera } from "lucide-react";

export default function Page() {
  const [formData, setFormData] = useState({
    lugar: "",
    categoria: "",
    urgencia: "",
    titulo: "",
    descripcion: "",
    imagenAntes: null,
  });
  const [lugares, setLugares] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [imagenPreview, setImagenPreview] = useState(null);
  const totalSteps = 4;
  const router = useRouter();

  useEffect(() => {
    fetchLugares();
    fetchCategorias();
  }, []);

  const fetchLugares = async () => {
    try {
      const response = await fetch("/api/manitas/lugares/listar");
      const data = await response.json();
      setLugares(data.data);
    } catch (error) {
      setAlertMessage({ type: "error", message: "Error al cargar Lugares" });
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch("/api/manitas/categorias/listar");
      const data = await response.json();
      setCategorias(data.data);
    } catch (error) {
      setAlertMessage({ type: "error", message: "Error al cargar Categorias" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, imagenAntes: file }));
    setImagenPreview(URL.createObjectURL(file));
  };

  const isFormComplete = () => {
    const { lugar, categoria, urgencia, titulo, descripcion, imagenAntes } = formData;
    if (activeStep === 1 && lugar) return true;
    if (activeStep === 2 && categoria && urgencia) return true;
    if (activeStep === 3 && titulo && descripcion) return true;
    if (activeStep === 4 && imagenAntes) return true;
    return false;
  };

  const handleNextStep = () => {
    if (isFormComplete()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage(null);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch("/api/manitas/tareas/crear", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        // Muestra el toast de éxito
        toast("Tarea creada exitosamente",{description: "La tarea de mantenimiento ha sido registrada correctamente.",});

        setFormData({
          lugar: "",
          categoria: "",
          urgencia: "",
          titulo: "",
          descripcion: "",
          imagenAntes: null,
        });
        setImagenPreview(null);
        setActiveStep(1);
        router.push("/dashboard/mantenimiento/tareas");
      } else {
        toast.error("La tarea no se creado",{description: "Error al crear la tarea"});
        setAlertMessage({ type: "error", message: "Error al crear la tarea" });
      }
    } catch (error) {
      toast.error("La tarea no se creado",{description: "Error al crear la tarea"});
      setAlertMessage({ type: "error", message: error.message });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Crear tarea de mantenimiento</CardTitle>
          <CardDescription className="text-center">
            Completa el formulario para crear una nueva tarea de mantenimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-1/4 h-2 rounded-full ${
                    step <= activeStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-500">
              Paso {activeStep} de {totalSteps}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {activeStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="lugar">Lugar</Label>
                  <Select name="lugar" value={formData.lugar} onValueChange={(value) => handleInputChange({ target: { name: 'lugar', value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un lugar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Lugares disponibles</SelectLabel>
                        {lugares.map((lugar) => (
                          <SelectItem key={lugar._id} value={lugar._id}>
                            {lugar.nombre}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select name="categoria" value={formData.categoria} onValueChange={(value) => handleInputChange({ target: { name: 'categoria', value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categorías disponibles</SelectLabel>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria._id} value={categoria._id}>
                            {categoria.nombre}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="urgencia">Urgencia</Label>
                  <Select name="urgencia" value={formData.urgencia} onValueChange={(value) => handleInputChange({ target: { name: 'urgencia', value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la urgencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Nivel de urgencia</SelectLabel>
                        <SelectItem value="baja">Baja</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Ingrese el título de la tarea"
                  />
                </div>
                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Describa la tarea en detalle"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="imagenAntes">Imagen Antes</Label>
                  <div className="mt-2 flex items-center justify-center w-full">
                    <label
                      htmlFor="imagenAntes"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                      </div>
                      <Input
                        id="imagenAntes"
                        name="imagenAntes"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
                {imagenPreview && (
                  <div className="mt-4">
                    <img src={imagenPreview} alt="Vista previa" className="max-w-full h-auto rounded-lg shadow-md" />
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {activeStep > 1 && (
                <Button type="button" variant="outline" onClick={() => setActiveStep(prev => prev - 1)}>
                  Anterior
                </Button>
              )}
              {activeStep < totalSteps ? (
                <Button type="button" onClick={handleNextStep} disabled={!isFormComplete()}>
                  Siguiente
                </Button>
              ) : (
                <Button type="submit" disabled={!isFormComplete()}>
                  Crear Tarea
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}