"use client";
import { useState, useEffect, useMemo } from 'react';
import { Trash2, Info, Upload, Check, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS

export default function MaintenanceTasks() {
  const [tareas, setTareas] = useState([]);
  const [categorias, setCategorias] = useState([]); // Aquí almacenamos las categorías
  const [lugares, setLugares] = useState([]); // Aquí almacenamos los lugares
  const [filtroUrgencia, setFiltroUrgencia] = useState('todas');
  const [filtroCategoria, setFiltroCategoria] = useState('todas'); // Filtro por categoría
  const [filtroLugar, setFiltroLugar] = useState('todos'); // Filtro por lugar
  const [ordenamiento, setOrdenamiento] = useState('fecha');
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  // Fetch tareas, lugares y categorías al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch de categorías
        const responseCategorias = await fetch("/api/manitas/categoria/listar");
        const dataCategorias = await responseCategorias.json();
        setCategorias(dataCategorias);

        // Fetch de lugares
        const responseLugares = await fetch("/api/manitas/lugar/listar");
        const dataLugares = await responseLugares.json();
        setLugares(dataLugares);

        // Fetch de tareas
        const responseTareas = await fetch("/api/manitas/tareas/listar");
        const dataTareas = await responseTareas.json();

        // Asociar cada tarea con el nombre de la categoría y del lugar
        const tareasConDetalles = dataTareas.map(tarea => {
          const lugarEncontrado = dataLugares.find(lugar => lugar._id === tarea.lugar);
          const categoriaEncontrada = dataCategorias.find(categoria => categoria._id === tarea.categoria);
          return {
            ...tarea,
            nombreLugar: lugarEncontrado ? lugarEncontrado.nombre : "Lugar no encontrado",
            nombreCategoria: categoriaEncontrada ? categoriaEncontrada.nombre : "Categoría no encontrada"
          };
        });

        // Filtrar solo las tareas no completadas
        const tareasPendientes = tareasConDetalles.filter(tarea => !tarea.completada);
        setTareas(tareasPendientes);
      } catch (error) {
        console.error("Error al fetchear los datos:", error);
      }
    };

    fetchData();
  }, []);


  const tareasFiltradas = useMemo(() => {
    return tareas
      .filter(tarea => filtroUrgencia === 'todas' || tarea.urgencia === filtroUrgencia)
      .filter(tarea => filtroCategoria === 'todas' || tarea.categoria === filtroCategoria) // Filtrar por nombre de categoría
      .filter(tarea => filtroLugar === 'todos' || tarea.lugar === filtroLugar) // Filtrar por nombre de lugar
      .sort((a, b) => {
        if (ordenamiento === 'urgencia') {
          const orden = { 'alta': 0, 'media': 1, 'baja': 2 };
          return orden[a.urgencia] - orden[b.urgencia];
        } else {
          return new Date(b.fechaCreada) - new Date(a.fechaCreada);
        }
      });
  }, [tareas, filtroUrgencia, filtroCategoria, filtroLugar, ordenamiento]);

  const completarTarea = (id, imagenUrl) => {
    setTareas(tareas.map(tarea =>
      tarea._id === id ? { ...tarea, completada: true, imagenUrl } : tarea
    ));
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter(tarea => tarea._id !== id));
  };

  const getUrgenciaColor = (urgencia) => {
    switch (urgencia) {
      case 'baja': return 'bg-green-500';
      case 'media': return 'bg-yellow-500';
      case 'alta': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && tareaSeleccionada) {
      const reader = new FileReader();
      reader.onloadend = () => {
        completarTarea(tareaSeleccionada._id, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Listado de Mantenimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 mb-4">
          <div className="flex flex-wrap gap-2 justify-between">
            <Select className="w-auto" value={filtroUrgencia} onValueChange={setFiltroUrgencia}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por urgencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las urgencias</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
            <Select  className="w-auto"value={filtroCategoria} onValueChange={setFiltroCategoria}> {/* Filtro por categoría */}
              <SelectTrigger className="w-[180px]">
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
            <Select  className="w-auto" value={filtroLugar} onValueChange={setFiltroLugar}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por lugar" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="todos">Todas los lugares</SelectItem>
                    {lugares.map(lugar => (
                  <SelectItem key={lugar._id} value={lugar._id}>
                    {lugar.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            onClick={() => setOrdenamiento(prev => prev === 'urgencia' ? 'fecha' : 'urgencia')}
          >
            Ordenar por {ordenamiento === 'urgencia' ? 'Fecha' : 'Urgencia'}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <ul className="space-y-4">
          {tareasFiltradas.map(tarea => (
            <li key={tarea._id} className="flex items-center justify-between space-x-2 p-2 bg-secondary rounded-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getUrgenciaColor(tarea.urgencia)}`} />
                <span className={tarea.completada ? "line-through text-muted-foreground" : ""}>
                  {tarea.titulo} - {tarea.nombreLugar}
                </span>
              </div>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Info className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{tarea.titulo}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">
                      <Label className="font-bold">Descripción:</Label>
                      <p>{tarea.descripcion}</p>
                    </div>
                    <div className="mt-2">
                      <Label className="font-bold">Lugar:</Label>
                      <p>{tarea.nombreLugar}</p>
                    </div>
                    <div className="mt-2">
                      <Label className="font-bold">Fecha de creación:</Label>
                      <p>{new Date(tarea.fechaCreada).toLocaleDateString()}</p>
                    </div>
                    {tarea.imagenAntes && (
                      <div className="mt-4">
                        <Label className="font-bold">Imagen del trabajo:</Label>
                        <img src={NEXT_PUBLIC_URL_API_MANITAS+"/uploads/"+tarea.imagenAntes} alt="Tarea antes" className="mt-2 max-w-full h-auto rounded-lg" />
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" disabled={tarea.completada}>
                      {tarea.completada ? <Check className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Completar Tarea</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <Label htmlFor="imagen">Subir imagen de la tarea completada:</Label>
                      <Input
                        id="imagen"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setTareaSeleccionada(tarea);
                          handleImageUpload(e);
                        }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
