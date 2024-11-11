// FiltroTareas.jsx
import React from 'react'
import { Trash2, XCircleIcon } from 'lucide-react'

const FiltroTareas = ({ lugares, categorias, onFiltrarLugar, onFiltrarUrgencia, onFiltrarCategoria, onLimpiarFiltros, filtroLugar, filtroUrgencia, filtroCategoria }) => {
  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4 p-4 bg-white rounded-lg shadow-md">
      
      <select 
        value={filtroLugar}
        onChange={(e) => onFiltrarLugar(e.target.value)} 
        className="border p-2 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos los Lugares</option>
        {lugares.map((lugar, index) => (
          <option key={index} value={lugar}>{lugar}</option>
        ))}
      </select>

      <select 
        value={filtroUrgencia}
        onChange={(e) => onFiltrarUrgencia(e.target.value)} 
        className="border p-2 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        <option value="">Todas las Urgencias</option>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>

      <select 
        value={filtroCategoria}
        onChange={(e) => onFiltrarCategoria(e.target.value)} 
        className="border p-2 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Todas las Categorías</option>
        {categorias.map((categoria, index) => (
          <option key={index} value={categoria}>{categoria}</option>
        ))}
      </select>

      <button 
        onClick={onLimpiarFiltros} 
        className="flex items-center space-x-2 p-2 text-red-500 hover:text-red-700 focus:outline-none justify-end w-full"
        aria-label="Limpiar filtros"
      >
        <Trash2 className="h-6 w-6" />
      </button>
    </div>
  )
}

export default FiltroTareas
