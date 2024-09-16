'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Page() {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [lugarSeleccionado, setLugarSeleccionado] = useState('') // Estado para el lugar seleccionado
  const [rubro, setRubro] = useState('')
  const [foto, setFoto] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [lugares, setLugares] = useState([]) // Estado para la lista de lugares

  useEffect(() => {
    fetchCategorias();
    fetchLugares();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await fetch("/api/manitas/categorias/list");
      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData);
        setCategorias(responseData.categorias || []); 
      } else {
        console.error("Error en la respuesta de la API:", responseData);
      }
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const fetchLugares = async () => {
    try {
      const response = await fetch("/api/manitas/lugares/list");
      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData);
        setLugares(responseData.lugares || []); // Guardamos la lista de lugares en el estado lugares
      } else {
        console.error("Error en la respuesta de la API:", responseData);
      }
    } catch (error) {
      console.error("Error fetching lugares:", error);
    }
  };

  const handleFotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí normalmente enviarías los datos a un servidor
    console.log('Trabajo de mantenimiento creado:', { titulo, descripcion, lugarSeleccionado, rubro, foto });
    // Reiniciar el formulario
    setTitulo('');
    setDescripcion('');
    setLugarSeleccionado(''); // Reiniciar el lugar seleccionado
    setRubro('');
    setFoto(null);
    setPreviewUrl(null);
    alert('Trabajo de mantenimiento creado con éxito!');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Crear Trabajo de Mantenimiento</CardTitle>
        <CardDescription>Ingrese los detalles del trabajo y adjunte una foto si es necesario.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lugar">Lugar</Label>
            <Select value={lugarSeleccionado} onValueChange={setLugarSeleccionado} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un lugar" />
              </SelectTrigger>
              <SelectContent>
                {lugares.map((lugar) => (
                  <SelectItem key={lugar._id} value={lugar.nombre}>
                    {lugar.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rubro">Rubro</Label>
            <Select value={rubro} onValueChange={setRubro} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un rubro" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria._id} value={categoria.titulo}>
                    {categoria.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="foto">Toma una Foto</Label>
            <Input
              id="foto"
              type="file"
              accept="image/*"
              capture="environment" // Esto habilita la cámara en dispositivos móviles
              onChange={handleFotoChange}
              required
            />
          </div>
          {previewUrl && (
            <div className="mt-4">
              <img src={previewUrl} alt="Vista previa" className="max-w-full h-auto rounded-lg" />
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} className="w-full">Crear Trabajo</Button>
      </CardFooter>
    </Card>
  )
}
