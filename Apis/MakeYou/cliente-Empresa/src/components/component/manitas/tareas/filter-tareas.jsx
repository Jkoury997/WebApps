import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FiltersTareas({
  filtroUrgencia,
  setFiltroUrgencia,
  filtroCategoria,
  setFiltroCategoria,
  categorias,
  filtroLugar,
  setFiltroLugar,
  lugares
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-between">
      <Select className="w-auto" value={filtroUrgencia} onValueChange={setFiltroUrgencia}>
        <SelectTrigger className="w-full md:w-[180px] sm:w-[180px]">
          <SelectValue placeholder="Filtrar por urgencia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas las urgencias</SelectItem>
          <SelectItem value="baja">Baja</SelectItem>
          <SelectItem value="media">Media</SelectItem>
          <SelectItem value="alta">Alta</SelectItem>
        </SelectContent>
      </Select>

      <Select className="w-auto" value={filtroCategoria} onValueChange={setFiltroCategoria}>
        <SelectTrigger className="w-full md:w-[180px] sm:w-[180px]">
          <SelectValue placeholder="Filtrar por categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas las categorías</SelectItem>
          {categorias.map(categoria => (
            <SelectItem key={categoria._id} value={categoria._id}>
              {categoria.titulo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select className="w-auto" value={filtroLugar} onValueChange={setFiltroLugar}>
        <SelectTrigger className="w-full md:w-[180px] sm:w-[180px]">
          <SelectValue placeholder="Filtrar por lugar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los lugares</SelectItem>
          {lugares.map(lugar => (
            <SelectItem key={lugar._id} value={lugar._id}>
              {lugar.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
