"use client"
import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FiltersTareas from "@/components/component/manitas/tareas/filter-tareas";
import ItemTarea from "@/components/component/manitas/tareas/item-tarea";
import { useFetchDataManitas } from '@/hooks/fetchDataManitas';
import { Alert } from "@/components/ui/alert";
import ItemTareaSupevisar from "@/components/component/manitas/tareas/item-tarea-supervisar";

export default function Page() {
  const { tareas, categorias, lugares, refetchTareas } = useFetchDataManitas(true); // Obtener la función refetchTareas
  const [filtroUrgencia, setFiltroUrgencia] = useState("todas");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroLugar, setFiltroLugar] = useState("todos");
  const [ordenamiento, setOrdenamiento] = useState("urgencia");
  const [alertMessage, setAlertMessage] = useState(null);

  // Filtrar tareas según los filtros seleccionados
  const tareasFiltradas = useMemo(() => {
    return tareas
      .filter((tarea) => {
        return (filtroUrgencia === "todas" || tarea.urgencia === filtroUrgencia) &&
               (filtroCategoria === "todas" || tarea.categoria._id === filtroCategoria) &&
               (filtroLugar === "todos" || tarea.lugar._id === filtroLugar);
      })
      .sort((a, b) => {
        if (ordenamiento === "urgencia") {
          return a.urgencia.localeCompare(b.urgencia);
        } else {
          return new Date(b.fechaCreada) - new Date(a.fechaCreada);
        }
      });
  }, [tareas, filtroUrgencia, filtroCategoria, filtroLugar, ordenamiento]);


  const handleCompleteTarea = async (tareaId, nota, imagen) => {
    const formData = new FormData();
    formData.append('nota', nota);
    formData.append('imagenDespues', imagen);
  
    try {
      const response = await fetch(`/api/manitas/tareas/completar?tareaId=${tareaId}`, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        // Manejar la respuesta exitosa
        console.log("Tarea completada");
        setAlertMessage({
          type: "success",
          message: "Tarea completada exitosamente.",
        });
        // Llamar a la función para recargar el listado de tareas
        await refetchTareas();
      } else {
        // Manejar errores
        setAlertMessage({
          type: "error",
          message: "Error al completar la tarea",
        });
        console.error("Error al completar la tarea");
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: ("Error al hacer la llamada a la API:", error),
      });
      console.error("Error al hacer la llamada a la API:", error);
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

    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Listado de Mantenimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <FiltersTareas
          filtroUrgencia={filtroUrgencia}
          setFiltroUrgencia={setFiltroUrgencia}
          filtroCategoria={filtroCategoria}
          setFiltroCategoria={setFiltroCategoria}
          categorias={categorias}
          filtroLugar={filtroLugar}
          setFiltroLugar={setFiltroLugar}
          lugares={lugares}
        />
        <Button
          variant="outline"
          onClick={() => setOrdenamiento((prev) => (prev === "urgencia" ? "fecha" : "urgencia"))}
          className="w-full mt-2"
        >
          Ordenar por {ordenamiento === "urgencia" ? "Fecha" : "Urgencia"}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        <div className="mt-2">
          {tareas.map((tarea) => (
            <ItemTareaSupevisar key={tarea._id} tarea={tarea} handleComplete={handleCompleteTarea} />
        ))}
      </div>
      
     

      </CardContent>
    </Card>
    </>
  );
}
