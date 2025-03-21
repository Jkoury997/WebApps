"use client";

import { useState, useRef } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/component/sale/dashboard-stats";
import { DatePickerWithRange } from "@/components/component/sale/date-picker";
import { SalesDetailTable } from "@/components/component/sale/details-sale";
import { SalesChart } from "@/components/component/sale/sale-chart";
import { StoreSelector } from "@/components/component/sale/select-store";
import RankingProducts from "@/components/component/sale/ranking-products";

// 🔹 Función para obtener el rango de fechas del último mes
function getLastMonthRange() {
  const lastMonth = subMonths(new Date(), 1);
  return {
    from: startOfMonth(lastMonth),
    to: endOfMonth(lastMonth),
  };
}

export default function Page() {
  const [selectedStore, setSelectedStore] = useState("ZZZZZ");
  const [stats, setStats] = useState(null);
  const [date, setDate] = useState(getLastMonthRange());
  const [showResults, setShowResults] = useState(false);
  const [rankingData, setRankingData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const abortControllerRef = useRef(null);

  // 🔹 Función para buscar datos
  const handleSearch = async () => {
    setIsCancelled(false); // Resetear estado de cancelación
    // Cancela cualquier solicitud anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      from: format(date.from, "yyyy-MM-dd"),
      to: format(date.to, "yyyy-MM-dd"),
    });

    if (selectedStore) {
      queryParams.append("store", selectedStore);
    }

    const queryParamsDia = new URLSearchParams({
      from: format(date.from, "yyyy-MM-dd"),
      to: format(date.to, "yyyy-MM-dd"),
    });

    if (selectedStore && selectedStore !== "ZZZZZ") {
      queryParamsDia.append("store", selectedStore);
    }

    const queryParamsRanking = new URLSearchParams({
      from: format(date.from, "dd-MM-yyyy"),
      to: format(date.to, "dd-MM-yyyy"),
      
    });

    if (selectedStore && selectedStore !== "ZZZZZ") {
      queryParamsRanking.append("store", selectedStore);
    }

    try {
      // 🔹 Ejecutar todas las peticiones en paralelo con Promise.all
      const [statsResponse, rankingResponse, salesResponse] = await Promise.all([
        fetch(`/api/leona/consultastiendas/variables?${queryParams}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        }),
        fetch(`/api/leona/consultastiendas/ranking/top?${queryParamsRanking}`, {
          signal: controller.signal,
        }),
        fetch(`/api/leona/consultastiendas/variables/dia?${queryParamsDia}`, {
          signal: controller.signal,
        }),
      ]);

      if (!statsResponse.ok || !rankingResponse.ok || !salesResponse.ok) {
        throw new Error("Error al obtener los datos");
      }

      const statsData = await statsResponse.json();
      const rankingData = await rankingResponse.json();
      const salesData = await salesResponse.json();

      setStats(statsData.Variables);
      setRankingData(rankingData.Lista.slice(0, 15)); // Solo los primeros 15

      setSalesData(
        salesData.Variables.map((item) => ({
          date: item.Fecha,
          ventas: item.Bruto, // o item.Neto si prefieres
        }))
      );
      

      console.log(salesData)
      console.log(statsData)
      console.log(rankingData)

      setShowResults(true);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Petición cancelada");
      } else {
        console.error("Error al buscar ventas:", error);
      }
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

    // 🔹 Función para cancelar la búsqueda
    const handleCancel = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort(); // Cancela la petición activa
      }
      setIsLoading(false); // Reactivar el botón de búsqueda
      setIsCancelled(true);
    };
  

  return (
    <Card>
      <CardHeader className="p-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold">Dashboard de Ventas</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <DatePickerWithRange date={date} setDate={setDate} />
            <StoreSelector
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
            />
            {!isLoading && (
              <Button onClick={handleSearch} disabled={isLoading}>
                Buscar
              </Button>
            )}

            {/* Botón de Cargando / Cancelar */}
            {isLoading && (
              <div className="flex gap-2">
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando...
                </Button>
                <Button variant="destructive" onClick={handleCancel}>
                  <XCircle className="h-7 w-7" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
      {isLoading && (
    <p className="text-center text-gray-500">Cargando datos...</p>
      )}


      {!isLoading && showResults && (
          <>
            <DashboardStats stats={stats} store={selectedStore} />
            
            <Tabs defaultValue="ventas-diarias" className="w-full mt-2">
              <TabsList className=" w-full p-4">
                <TabsTrigger value="ventas-diarias">Ventas Diarias</TabsTrigger>
                <TabsTrigger value="ranking">Ranking</TabsTrigger>
              </TabsList>
              <TabsContent value="ventas-diarias" className=" pt-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Tendencia de Ventas Diarias</CardTitle>
                    <CardDescription>
                      Ventas totales por día durante el período seleccionado
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <SalesChart data={salesData} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ranking" className=" pt-2">
                <RankingProducts data={rankingData} />
              </TabsContent>
              <TabsContent value="categorias" className=" pt-2">
                <RankingProducts data={rankingData} />
              </TabsContent>
            </Tabs>

            <SalesDetailTable store={selectedStore} stats={stats} />
          </>
        )}   {!isLoading && !showResults && (
          <p className="text-gray-500 text-center">
            Realiza una búsqueda para ver los datos.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
