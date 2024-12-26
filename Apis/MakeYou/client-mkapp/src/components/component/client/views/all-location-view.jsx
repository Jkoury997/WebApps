import { useState,useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Clock, ChevronLeft, Star } from 'lucide-react'

export default function AllLocationsView({ setShowAllLocations }) {
  const [stores, setStores] = useState([]); // Estado para las stores

   // Cargar datos de stores desde el archivo JSON
    useEffect(() => {
      const loadStores = async () => {
        try {
          const response = await fetch("/places-details.json");
          if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
          }
          const data = await response.json();
  
          const storesArray = Object.keys(data)
            .map((key) => {
              const store = data[key];
              if (typeof store.location?.latitude === "number" && typeof store.location?.longitude === "number") {
                return {
                  id: key,
                  name: store.displayName.text || "Sin nombre",
                  lat: store.location.latitude,
                  lng: store.location.longitude,
                  address: store.formattedAddress || "Sin dirección",
                  placeUri:store.googleMapsLinks.placeUri,
                  writeReview:store.googleMapsLinks.writeAReviewUri,
                  
                };
              }
              return null; // Ignorar si lat o lng no son válidos
            })
            .filter((store) => store !== null); // Eliminar stores inválidas
  
          setStores(storesArray);
        } catch (error) {
          console.error("Error cargando stores:", error);
        }
      };
  
      loadStores();
    }, []);



  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-gray-800">Todos los Locales</CardTitle>
        <Button variant="ghost" onClick={() => setShowAllLocations(false)}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className=" rounded-md border p-4">
          {stores.map((store) => (
            <Card key={store.id} className="mb-4 last:mb-0">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{store.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <MapPin className="w-6 h-6 mr-2" />
                  <span>{store.address}</span>
                </div>
                <Button variant="outline"  className="w-full mt-2 bg-white text-gray border-none"
                onClick={() => window.open(store.writeReview)}>
                  <Star></Star>
                  <Star></Star>
                  <Star></Star>
                  <Star></Star>
                  <Star></Star>
                </Button>
                <Button variant="outline"  className="w-full mt-2 bg-brand text-white"
                onClick={() => window.open(store.placeUri)}>
                  Ver en Mapa
                </Button>
              </CardContent>

            </Card>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
