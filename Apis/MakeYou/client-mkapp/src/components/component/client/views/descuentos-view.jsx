import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExternalLink } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function DescuentosView() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedRubro, setSelectedRubro] = useState("todos")
  const [emblaApi, setEmblaApi] = useState(null)
  const emblaRef = useRef(null)

  useEffect(() => {
    if (emblaRef.current && emblaRef.current.emblaApi) {
      setEmblaApi(emblaRef.current.emblaApi)
    }
  }, [emblaRef])

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setSelectedIndex(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

  // Efecto para autoplay cada 3 segundos
  useEffect(() => {
    let autoplay
    if (emblaApi) {
      autoplay = setInterval(() => {
        emblaApi.scrollNext()
      }, 3000)
    }
    return () => {
      if (autoplay) clearInterval(autoplay)
    }
  }, [emblaApi])

  const rubros = [
    { id: "todos", name: "Todos los rubros" },
    { id: "ropa", name: "Ropa y Accesorios" },
    { id: "electronica", name: "Electrónica" },
    { id: "hogar", name: "Hogar y Muebles" },
    { id: "alimentos", name: "Alimentos y Bebidas" },
  ]

  const descuentos = [
    { store: "Tienda A", discount: "20% en ropa", image: "/placeholder.svg?height=200&width=200", rubro: "ropa" },
    { store: "Tienda B", discount: "15% en electrónicos", image: "/placeholder.svg?height=200&width=200", rubro: "electronica" },
    { store: "Tienda C", discount: "10% en accesorios", image: "/placeholder.svg?height=200&width=200", rubro: "ropa" },
    { store: "Tienda D", discount: "25% en muebles", image: "/placeholder.svg?height=200&width=200", rubro: "hogar" },
    { store: "Tienda E", discount: "30% en alimentos", image: "/placeholder.svg?height=200&width=200", rubro: "alimentos" },
  ]

  const filteredDescuentos = selectedRubro === "todos"
    ? descuentos
    : descuentos.filter(d => d.rubro === selectedRubro)

  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-gray-800">Descuentos Disponibles</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedRubro} onValueChange={setSelectedRubro}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Selecciona un rubro" />
          </SelectTrigger>
          <SelectContent>
            {rubros.map((rubro) => (
              <SelectItem key={rubro.id} value={rubro.id}>
                {rubro.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Carousel
          ref={emblaRef}
          opts={{ align: "start" }}
          className="w-full max-w-sm overflow-hidden relative"
        >
          <CarouselContent className="flex">
            {filteredDescuentos.map((item, index) => (
              <CarouselItem key={index} className="w-1/2 flex-shrink-0 px-2 box-border">
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-4">
                    <img src={item.image} alt={item.store} className="w-full h-40 object-cover rounded-t-lg mb-4" />
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">{item.store}</h3>
                    <p className="text-pink-600 font-medium mb-4">{item.discount}</p>
                    <Button variant="outline" size="sm" className="w-full text-pink-600 hover:text-pink-700 hover:bg-pink-50">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver oferta
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10" />
        </Carousel>

        <div className="flex justify-center mt-4 space-x-2">
          {filteredDescuentos.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === selectedIndex ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
