import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QrCode, Coins, MapPin } from 'lucide-react'
import React from "react"
import LoyaltyPoint from "@/components/component/client/components/loyalty-point"

export default function HomeView({ setShowAllLocations }) {
  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-col items-center space-y-2">
        <CardTitle className="text-2xl font-bold text-gray-800">Carlos Núñez</CardTitle>
        <Badge variant="secondary" className="bg-pink-100 text-pink-700">Cliente Oro</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <QrCode className="w-32 h-32 text-gray-600" />
        </div>
        <LoyaltyPoint Point={9999}></LoyaltyPoint>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Locales Cercanos</h3>
          <div className="aspect-video relative rounded-md overflow-hidden">
            <img
              src="/placeholder.svg?height=200&width=400"
              alt="Mapa de locales cercanos"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-pink-500" />
            </div>
          </div>
          <Button 
            variant="link" 
            className="w-full mt-2 text-pink-600 hover:text-pink-700"
            onClick={() => setShowAllLocations(true)}
          >
            Ver todos los locales
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
