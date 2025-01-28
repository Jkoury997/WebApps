"use client"

import ClienteCard from "@/components/component/admin/client/card-cliente"
import SearchClient from "@/components/component/admin/client/search-client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ClienteListado() {
  const [clientes, setClientes] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [clientesFiltrados, setClientesFiltrados] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    handleList()
  }, [])

  useEffect(() => {
    if (clientes) {
      setClientesFiltrados(clientes)
      setIsLoading(false) // Se detiene el indicador de carga cuando los datos están listos
    }
  }, [clientes])

  const handleBusqueda = (terminoBusqueda) => {
    setBusqueda(terminoBusqueda)
    const filtrados = clientes.filter(
      (cliente) =>
        cliente.firstname.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        cliente.email.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        cliente.lastname.toLowerCase().includes(terminoBusqueda.toLowerCase())||
        cliente.dni.includes(terminoBusqueda)
    )
    setClientesFiltrados(filtrados)
  }

  const handleNotificar = (id) => {
    toast.success(`Notificación enviada al cliente con ID: ${id}`)
  }

  const handleEliminar = (id) => {
    const nuevosClientes = clientesFiltrados.filter(cliente => cliente.id !== id)
    setClientesFiltrados(nuevosClientes)
    toast.error(`Cliente eliminado`)
  }

  const handleList = async () => {
    try {
      const response = await fetch("/api/auth/user/list")
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`)
      }
      const data = await response.json()
      setClientes(data)
      console.log("Datos recibidos:", data)
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error)
      setIsLoading(false) // Detiene el indicador de carga incluso si ocurre un error
    }
  }

  if (isLoading) {
    return <div className="container mx-auto p-4 min-h-screen">Cargando clientes...</div>
  }

  return (
    <div className="container mx-auto  min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Listado de Clientes</h1>
      </div>
      <SearchClient busqueda={busqueda} onBusqueda={handleBusqueda} />
      <div className="space-y-4">
        {clientesFiltrados?.map((cliente) => (
          <ClienteCard
            key={cliente._id}
            cliente={cliente}
            onEditar={() => {}} // Manejo de edición por implementar
            onNotificar={handleNotificar}
            onEliminar={handleEliminar}
          />
        ))}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  )
}
