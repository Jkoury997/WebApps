"use client"

import { useEffect, useState } from 'react'
import TaskList from "@/components/component/manitas/tareas/task-list"

export default function App() {
  const [tareas, setTareas] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTareas = async () => {
    try {
      const response = await fetch("/api/manitas/tareas/listar")
      const data = await response.json()
      setTareas(data) // Almacena las tareas en el estado
      console.log(data)
    } catch (error) {
      console.error("Error al obtener las tareas:", error)
    } finally {
      setIsLoading(false) // Marca la carga como completada
    }
  }

  useEffect(() => {
    fetchTareas() // Llama a fetchTareas cuando el componente se monte
  }, [])

  if (isLoading) {
    return <div>Loading...</div> // Mostrar un mensaje o spinner mientras se cargan los datos
  }

  return (
    <div>
      <TaskList tareasIniciales={tareas} />
    </div>
  )
}
