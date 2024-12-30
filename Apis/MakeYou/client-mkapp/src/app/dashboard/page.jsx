"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Ticket, ShoppingBag, Percent, ReceiptText, ArrowBigLeft } from "lucide-react";

import HomeView from "@/components/component/client/views/home-view";
import TicketsView from "@/components/component/client/views/tickets-view";
import PedidosView from "@/components/component/client/views/pedidos-view";
import AllLocationsView from "@/components/component/client/views/all-location-view";
import DescuentosView from "@/components/component/client/views/descuentos-view";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { driver } from "driver.js";



export default function Page() {
  const [userData, setUserData] = useState(null);
  const [activeView, setActiveView] = useState("home");
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTutorialCompletedInicio, setIsTutorialCompletedInicio] = useState(false)
  const generateFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/user/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Datos del usuario:", data);

      setUserData(data);
    } catch (error) {
      console.error("Error al obtener los datos del cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);


    const startTourInicio = () => {
      const driverObj = driver({
        popoverClass: 'driverjs-theme',
        nextBtnText: "Siguiente",
        prevBtnText: "Volver",
        doneBtnText: "Terminar",
        animate: true, // Animaciones entre pasos
        allowClose: false,
        steps:[
          {
            
            popover: {
              title: "Bienvenido a MK",
              description: "Te daremos un breve recorrido",
              position: "top",
            },
          },
          {
            element: "#step1",
            popover: {
              title: "Esto es el Inicio",
              description: "Ahora te mostrare lo que puedes encontrar",
              position: "top",
            },
          },
          {
            element: "#QR",
            popover: {
              title: "Codigo QR",
              description: "Aquí puedes ver tu QR para las tiendas.",
              position: "top",
            },
          },
          {
            element: "#PUNTOS",
            popover: {
              title: "Puntos MK",
              description: "Aquí puedes ver tus puntos acumulados.",
              position: "top",
            },
          },
          {
            element: "#TIENDAS",
            popover: {
              title: "Locales Cercanos",
              description: "Aquí puedes explorar las tiendas cercanas.",
              position: "top",
            },
          },
        ],
        
        onNextClick:() => {
            if(driverObj.isLastStep()){
              console.log("Hola")
                localStorage.setItem("tutorialCompletedInicio", "true");
                setIsTutorialCompletedInicio(true);
            }
            driverObj.moveNext()
        }
     

    });
  
      driverObj.drive();
    };

    useEffect(() => {
        // Verifica si el tutorial ya fue completado al cargar la página
        const tutorialCompletedInicio = localStorage.getItem("tutorialCompletedInicio");
        setIsTutorialCompletedInicio(tutorialCompletedInicio);
    
        if (!tutorialCompletedInicio && !loading) {
          startTourInicio();
        }
      }, [loading]);

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-4">
        {showAllLocations ? (
          <AllLocationsView setShowAllLocations={setShowAllLocations} />
        ) : (
          <>

            <Tabs
              value={activeView}
              onValueChange={setActiveView}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 bg-white">
                <TabsTrigger
                  id="step1"
                  value="home"
                  className="data-[state=active]:bg-brand data-[state=active]:text-white"
                >
                  <Home className="w-5 h-5" />
                </TabsTrigger>
                <TabsTrigger
                  id="step2"
                  value="tickets"
                  className="data-[state=active]:bg-brand data-[state=active]:text-white"
                >
                  <ReceiptText className="w-5 h-5" />
                </TabsTrigger>
                <TabsTrigger
                  id="step3"
                  value="pedidos"
                  className="data-[state=active]:bg-brand data-[state=active]:text-white"
                >
                  <ShoppingBag className="w-5 h-5" />
                </TabsTrigger>
              </TabsList>
              <TabsContent value="home">
                <HomeView
                  setShowAllLocations={setShowAllLocations}
                  userData={userData}
                />
              </TabsContent>
              <TabsContent value="tickets">
                <TicketsView userData={userData} />
              </TabsContent>
              <TabsContent value="pedidos">
                <PedidosView userData={userData} />
              </TabsContent>
              <TabsContent value="descuentos">
                <DescuentosView userData={userData} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
