import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Star } from "lucide-react";
import React, { useState,useEffect,useRef } from "react";
import LoyaltyPoint from "@/components/component/client/components/loyalty-point";
import { Skeleton } from "@/components/ui/skeleton";
import QRCode from "react-qr-code";
import MapaStores from "../components/maps-store";


export default function HomeView({ setShowAllLocations, userData}) {

  const [loading, setLoading] = useState(false);
  const [userPoints, setUserPoints] = useState(null);
  const [store, setStore] = useState(null);
  const [qr,setQr] = useState(null);

  const storeInfoRef = useRef(null);



  useEffect(() => {
    if (userData?.dni) {
      fetchPoints(userData.dni);
      const qrJson = {Id:userData.dni}

      setQr(JSON.stringify(qrJson))
      console.log(qr)
    
    }
  }, [userData]);

  




  const fetchPoints = async (dni) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/nasus/cliente/puntos?dni=${dni}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setUserPoints(data);
    } catch (error) {
      console.error("Error al obtener las Puntos del cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSelection = (selectedStore) => {
    setStore(selectedStore)
    setTimeout(() => {
      if(storeInfoRef.current){
        storeInfoRef.current.scrollIntoView({ behavior: 'smooth',block:"center" });
      }
    },100)
    
    
  };

  if (!userData || !userPoints || loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-col items-center space-y-2">
        <CardTitle className="text-2xl font-bold text-gray-800">
          {userData.firstName || "Usuario"} {userData.lastName || "Usuario"}
        </CardTitle>
        <Badge variant="secondary" className="bg-brand text-white">
          {userData.tier || "Cliente"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">

          {qr ? (
            <div className="bg-white p-4 rounded-3xl shadow-sm">
                <QRCode  className=" text-gray-600 " size={150} value={qr}   level="H"  bgColor="#fff" ></QRCode>
                
            </div>
            
          ):(
            <QrCode className="w-32 h-32 text-gray-600 " />
          )}
          
        </div>

        
        <LoyaltyPoint Point={userPoints.Puntos || 0} />


        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Locales Cercanos</h3>
          <div className="aspect-video relative rounded-md overflow-hidden">

          <MapaStores onSelectStore={handleStoreSelection}></MapaStores>
           {/* Info Card at the bottom */}
       
          </div>
          <div>
           {store && (
            
            <Card className="border-none" ref={storeInfoRef}>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-bold text-gray-800">{store.name}</CardTitle>
                <CardDescription className="text-gray-600 mb-2 text-sm">{store.address}</CardDescription>
                
              </CardHeader>
              <CardContent className="pb-1">
              <Button className="w-full bg-white text-gray border-none hover:bg-white hover:text-brand"
                onClick={() => window.open(store.writeReview)}>
                  <Star></Star>
                  <Star></Star>
                  <Star></Star>
                  <Star></Star>
                  <Star></Star>
                </Button>
              </CardContent>
              <CardFooter className="pb-3">
              <Button
              className=" bg-brand text-white px-4 py-2 rounded hover:bg-black transition w-full"
              onClick={() => window.open(store.placeUri)}
            >
              Ir a la tienda
            </Button>
              </CardFooter>
            </Card>
        )}
           </div>
          <Button
            variant="link"
            className="w-full mt-2 text-brand hover:text-pink-700"
            onClick={() => setShowAllLocations(true)}
          >
            Ver todos los locales
          </Button>
        </div>


      </CardContent>
    </Card>
  );
}
