"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Ticket, ShoppingBag, Percent, Receipt, ReceiptText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Asegúrate de importar Skeleton desde ShadCN UI
import HomeView from "@/components/component/client/views/home-view";
import TicketsView from "@/components/component/client/views/tickets-view";
import PedidosView from "@/components/component/client/views/pedidos-view";
import AllLocationsView from "@/components/component/client/views/all-location-view";
import DescuentosView from "@/components/component/client/views/descuentos-view";
import FingerprintJS from "@fingerprintjs/fingerprintjs";


export default function Page() {
    const [isVerified, setIsVerified] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userPoints, setUserPoints] = useState(null);
    const [activeView, setActiveView] = useState("home");
    const [showAllLocations, setShowAllLocations] = useState(false);
    const [loading, setLoading] = useState(false);

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

    return (
        
        <div className="flex justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-4">
                {showAllLocations ? (
                    <AllLocationsView setShowAllLocations={setShowAllLocations} />
                ) : (
                    <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-white">
                            <TabsTrigger
                                value="home"
                                className="data-[state=active]:bg-brand data-[state=active]:text-white"
                            >
                                <Home className="w-5 h-5" />
                            </TabsTrigger>
                            <TabsTrigger
                                value="tickets"
                                className="data-[state=active]:bg-brand data-[state=active]:text-white"
                            >
                                <ReceiptText className="w-5 h-5" />
                            </TabsTrigger>
                            <TabsTrigger
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
                )}
            </div>
        </div>
    );
}
