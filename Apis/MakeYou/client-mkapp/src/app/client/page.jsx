"use client"
import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Ticket, ShoppingBag, Percent, ChevronLeft } from 'lucide-react'
import HomeView from "@/components/component/client/views/home-view"
import TicketsView from "@/components/component/client/views/tickets-view"
import PedidosView from "@/components/component/client/views/pedidos-view"

import AllLocationsView from "@/components/component/client/views/all-location-view"
import { Button } from "@/components/ui/button"
import DescuentosView from "@/components/component/client/views/descuentos-view"

export default function MainComponent() {
  const [activeView, setActiveView] = useState("home")
  const [showAllLocations, setShowAllLocations] = useState(false)

  return (
    <div className="flex justify-center  min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-4">
        {showAllLocations ? (
          <AllLocationsView setShowAllLocations={setShowAllLocations} />
        ) : (
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white">
              <TabsTrigger value="home" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700">
                <Home className="w-5 h-5" />
              </TabsTrigger>
              <TabsTrigger value="tickets" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700">
                <Ticket className="w-5 h-5" />
              </TabsTrigger>
              <TabsTrigger value="pedidos" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700">
                <ShoppingBag className="w-5 h-5" />
              </TabsTrigger>
              <TabsTrigger value="descuentos" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700">
                <Percent className="w-5 h-5" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="home">
              <HomeView setShowAllLocations={setShowAllLocations} />
            </TabsContent>
            <TabsContent value="tickets">
              <TicketsView />
            </TabsContent>
            <TabsContent value="pedidos">
              <PedidosView />
            </TabsContent>
            <TabsContent value="descuentos">
              <DescuentosView></DescuentosView>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
