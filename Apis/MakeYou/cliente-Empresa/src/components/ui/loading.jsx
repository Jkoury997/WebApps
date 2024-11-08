'use client'

import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function Loading() {
    const mensajes = [
        "Cargando datos...",
        "Esto puede tomar un momento...",
        "Casi listo...",
        "Un poco más de paciencia...",
        "Estamos preparando todo para ti...",
        "Solo un instante más...",
        "Ajustando los últimos detalles...",
        "Cargando información actualizada...",
        "Gracias por tu paciencia...",
        "¡Ya casi está listo!..."
    ];
  const [mensajeActual, setMensajeActual] = useState(mensajes[0])

  useEffect(() => {
    const intervalo = setInterval(() => {
      setMensajeActual(prevMensaje => {
        const indiceActual = mensajes.indexOf(prevMensaje)
        const siguienteIndice = (indiceActual + 1) % mensajes.length
        return mensajes[siguienteIndice]
      })
    }, 5000) // Cambia el mensaje cada 5 segundos

    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 transition-opacity duration-300 ease-in-out">
            {mensajeActual}
          </p>
        </div>
      </div>
    </div>
  )
}