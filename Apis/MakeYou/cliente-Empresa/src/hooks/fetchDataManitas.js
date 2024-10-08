import { useState, useEffect } from 'react';

export const useFetchDataManitas = (completada) => {
  const [tareas, setTareas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener los datos de las tareas
  const fetchTareas = async () => {
    try {
      setLoading(true);
      setError(null);

      const [responseCategorias, responseLugares, responseTareas] = await Promise.all([
        fetch("/api/manitas/categoria/listar"),
        fetch("/api/manitas/lugar/listar"),
        fetch("/api/manitas/tareas/listar"),
      ]);

      if (!responseCategorias.ok || !responseLugares.ok || !responseTareas.ok) {
        throw new Error("Error al obtener datos de la API");
      }

      const dataCategorias = await responseCategorias.json();
      const dataLugares = await responseLugares.json();
      const dataTareas = await responseTareas.json();

      // Filtra solo las tareas que no están completadas
      if(completada){
        setTareas(dataTareas.filter((tarea) => tarea.completada));
      }else{
        setTareas(dataTareas.filter((tarea) => !tarea.completada));
      }
      
      setCategorias(dataCategorias);
      setLugares(dataLugares);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para volver a cargar las tareas
  const refetchTareas = async () => {
    await fetchTareas(); // Vuelve a ejecutar la función fetchTareas
  };

  // Ejecutar fetch al cargar el componente
  useEffect(() => {
    fetchTareas();
  }, []);

  return { tareas, categorias, lugares, loading, error, refetchTareas, setTareas };
};
