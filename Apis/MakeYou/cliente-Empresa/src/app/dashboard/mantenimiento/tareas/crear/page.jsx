"use client";

import { useState } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import TaskCreationWithImage from "@/components/component/mantenimiento/tarea-create";

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const zona = searchParams.get("zona");

  const handleCreateTask = async (taskData, imageFile) => {
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      // 🔹 **PASO 1: Crear la tarea**
      const formDataTask = new FormData();
      formDataTask.append("nombre", taskData.nombre);
      formDataTask.append("descripcion", taskData.descripcion);
      formDataTask.append("categoria", taskData.categoria);
      formDataTask.append("ubicacionExpecifica", taskData.ubicacionExpecifica);

      const responseTask = await fetch(`/api/mantenimiento/tarea/crear?zona=${zona}`, {
        method: "POST",
        body: formDataTask,
      });

      if (!responseTask.ok) {
        throw new Error("Error al crear la tarea");
      }

      const resultTask = await responseTask.json();
      console.log("Tarea creada:", resultTask);

      // Extraer el ID de la tarea creada
      const tareaId = resultTask._id; // Asegúrate de que el backend devuelve un `id`

      // Paso 2: Subir la evidencia usando el ID de la tarea creada
      
      if (imageFile) {
        const formDataEvidence = new FormData();
        formDataEvidence.append("imagenes", imageFile); // Puedes agregar más imágenes si es necesario

        const responseEvidence = await fetch(`/api/mantenimiento/tarea/evidencia?tarea=${tareaId}`, {
          method: "POST",
          body: formDataEvidence,
        });

        if (!responseEvidence.ok) {
          throw new Error("Error al subir la evidencia");
        }

        console.log("Evidencia subida correctamente");
      }
      

      setIsSuccess(true);

      // Redirigir después de completar ambos pasos
      setTimeout(() => {
        router.push("/dashboard/mantenimiento/tareas");
      }, 2000);
    } catch (error) {
      console.error("Error en el proceso:", error);
      alert("Hubo un problema. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TaskCreationWithImage
      isSubmitting={isSubmitting}
      isSuccess={isSuccess}
      onCreateTask={handleCreateTask}
    />
  );
}
