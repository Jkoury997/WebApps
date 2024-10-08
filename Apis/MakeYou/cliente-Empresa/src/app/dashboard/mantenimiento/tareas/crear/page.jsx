"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { StepIndicator } from "@/components/component/step-indicartor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [lugar, setLugar] = useState("");
  const [lugares, setLugares] = useState([]); // Inicialización como array vacío
  const [categorias, setCategorias] = useState([]); // Inicialización como array vacío
  const [urgencia, setUrgencia] = useState([]); // Inicialización como array vacío
  const [imagenAntes, setImagenAntes] = useState(null); // Para manejar la imagen
  const [alertMessage, setAlertMessage] = useState(null);
  const [activeStep, setActiveStep] = useState(1); // Control del paso activo
  const totalSteps = 4;

  const [imagenPreview, setImagenPreview] = useState(null); // Estado para almacenar la URL de la imagen

// Función para manejar la carga de imagen
const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagenAntes(file); // Guardar la imagen seleccionada
    setImagenPreview(URL.createObjectURL(file)); // Crear una URL para mostrar la vista previa
};


  // Cargar lugares desde la API
  useEffect(() => {
    fetchLugares();
    fetchCategorias();
  }, []); // useEffect ahora está correctamente configurado



  // Función para cargar los lugares desde la API
  const fetchLugares = async () => {
    try {
      const response = await fetch("/api/manitas/lugar/listar");
      const data = await response.json();

      setLugares(data);
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Error al cargar Lugares",
      });
    }
  };

  // Función para cargar las categorías desde la API
  const fetchCategorias = async () => {
    try {
      const response = await fetch("/api/manitas/categoria/listar");
      const data = await response.json();

      setCategorias(data);
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Error al cargar Categorias",
      });
    }
  };

  // Validar si el formulario de cada paso está completo
  const isFormComplete = () => {
    if (activeStep === 1 && lugar) return true; // Paso 1: Selección del lugar
    if (activeStep === 2 && categoria && urgencia) return true; // Paso 2: Categoría
    if (activeStep === 3 && titulo && descripcion) return true; // Paso 3: Detalles
    if (activeStep === 4 && imagenAntes) return true; // Paso 4: Imagen
    return false;
  };

  // Función para cambiar al siguiente paso
  const handleNextStep = () => {
    if (isFormComplete()) {
      setActiveStep(activeStep + 1);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
    setAlertMessage(null);

    // Usamos FormData para enviar tanto los datos de texto como la imagen
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("categoria", categoria);
    formData.append("urgencia",urgencia)
    formData.append("lugar", lugar);
    formData.append("imagenAntes", imagenAntes); // Añadir la imagen seleccionada
     // Depurar el contenido de FormData
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
    try {
      // Enviar la solicitud al backend
      const response = await fetch("/api/manitas/tareas/crear", {
        method: "POST",
        body: formData, // Usamos FormData en lugar de JSON.stringify
      });

      if (response.ok) {
        const data = await response.json();
        setAlertMessage({
          type: "success",
          message: "Tarea creada exitosamente.",
        });
        // Reiniciar campos del formulario
        setTitulo("");
        setDescripcion("");
        setCategoria("");
        setUrgencia("");
        setLugar("");
        setImagenAntes(null); // Reiniciar la imagen
        setImagenPreview(null)
        setActiveStep(1); // Reiniciar el flujo de pasos
      } else {
        setAlertMessage({
          type: "error",
          message: "Error al crear la tarea",
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error.message,
      });
    }
  };

  return (
    <>
      {alertMessage && (
        <Alert
          type={alertMessage.type}
          title={alertMessage.type === "error" ? "Error" : "Éxito"}
          message={alertMessage.message}
          onClose={() => setAlertMessage(null)}
          className="mb-2"
        />
      )}

      {/* Indicador de pasos */}
      <div className="mb-3 flex flex-col items-center">
        <StepIndicator activeStep={activeStep} steps={totalSteps} />
      </div>


      <div className="mb-2 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 text-center">Crear tarea de mantenimieto</h1>
        <p className="text-muted-foreground text-center">
          Utiliza este formulario para crear una tarea de mantenimiento
        </p>
      </div>
      {/* Formulario dinámico basado en el paso activo */}
      {activeStep === 1 && (
        <Card className="mt-2">
          <CardHeader>
            <CardTitle>Seleccionar Lugar</CardTitle>
            <CardDescription>Selecciona el lugar para la tarea</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Selector de lugar */}
            <Select onValueChange={setLugar}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un lugar" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Lugar</SelectLabel>
                  {lugares.length > 0 ? (
                    lugares.map((lugar) => (
                      <SelectItem key={lugar._id} value={lugar._id}>
                        {lugar.nombre}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No hay lugares disponibles</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              type="button"
              className="w-full mt-3"
              disabled={!isFormComplete()}
              onClick={handleNextStep}
            >
              Siguiente
            </Button>
          </CardContent>
        </Card>
      )}

      {activeStep === 2 && (
        <Card className="mt-2">
          <CardHeader>
            <CardTitle>Seleccionar Categoria</CardTitle>
            <CardDescription>Selecciona la categoria para la tarea</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="mb-4">
          <Label>Categoria</Label>
            <Select onValueChange={setCategoria} >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categoria</SelectLabel>
                  {categorias.length > 0 ? (
                    categorias.map((categoria) => (
                      <SelectItem key={categoria._id} value={categoria._id}>
                        {categoria.titulo}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No hay categorias disponibles</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>
            {/* Selector de categoria */}
            <div className="mb-4">
            <Label>Urgencia</Label>
            <Select onValueChange={setUrgencia}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona Urgencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categoria</SelectLabel>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            </div>


            <Button
              type="button"
              className="w-full mt-3"
              disabled={!isFormComplete()}
              onClick={handleNextStep}
            >
              Siguiente
            </Button>
          </CardContent>
        </Card>
      )}

      {activeStep === 3 && (
        <Card className="mt-2">
          <CardHeader>
            <CardTitle>Detalles de la Tarea</CardTitle>
            <CardDescription>
              Ingresa el título y descripción de la tarea
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label>Título</Label>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label>Descripción</Label>
              <Input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>
            <Button
              type="button"
              className="w-full mt-3"
              disabled={!isFormComplete()}
              onClick={handleNextStep}
            >
              Siguiente
            </Button>
          </CardContent>
        </Card>
      )}

{activeStep === 4 && (
  <Card className="mt-2">
    <CardHeader>
      <CardTitle>Subir Imagen Antes</CardTitle>
      <CardDescription>
        Sube la imagen antes de realizar la tarea
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="mb-4">
        <Label>Imagen Antes</Label>
        <Input 
          type="file" 
          accept="image/*"  // Acepta solo imágenes
          capture="environment" // Utiliza la cámara trasera del dispositivo
          onChange={handleImageChange} 
          required 
        />
        {/* El campo de carga de imagen */}
      </div>

      {/* Mostrar la vista previa de la imagen seleccionada */}
      {imagenPreview ? (
        <div className="mb-4 flex justify-center">
          <img
            src={imagenPreview}
            alt="Vista previa"
            className="w-full h-auto max-w-xs rounded-md"
          />
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No se ha seleccionado ninguna imagen
        </div>
      )}
      <Button
        type="button"
        className="w-full mt-3"
        disabled={!imagenAntes}  // Deshabilita el botón si no hay imagen
        onClick={handleSubmit}
      >
        Crear Tarea
      </Button>
    </CardContent>
  </Card>
)}

    </>
  );
}
