import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Clock, ChevronLeft } from 'lucide-react'

export default function AllLocationsView({ setShowAllLocations }) {
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
          {[1, 2, 3, 4, 5].map((local) => (
            <Card key={local} className="mb-4 last:mb-0">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Local #{local}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Dirección del Local #{local}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Lun - Vie: 9:00 - 18:00</span>
                </div>
                <Button variant="outline" className="w-full mt-2">
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
