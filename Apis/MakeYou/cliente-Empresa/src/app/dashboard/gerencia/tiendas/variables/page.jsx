"use client";
import { useState, useEffect } from "react";
import { DatePicker } from "@/components/component/date-picker";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Selecter } from "@/components/component/selecter";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FilterIcon } from "lucide-react";
import SaleReport from "@/components/component/sale-report";
import { Skeleton } from "@/components/ui/skeleton";
import { subDays, subWeeks, subMonths, subYears } from "date-fns"; // date-fns para manejar las fechas

// Custom hook to detect screen size
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = () => setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", documentChangeHandler);
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener("change", documentChangeHandler);
    };
  }, [query]);

  return matches;
}

// Función para calcular la variación porcentual entre dos valores
const calcularVariacion = (actual, previo) => {
  if (previo == null || isNaN(actual) || isNaN(previo) || previo === 0) return "N/A";
  const variacion = ((actual - previo) / previo) * 100;
  return variacion.toFixed(2);
};

export default function Page() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [compareOption, setCompareOption] = useState(null);
  const [storeOption, setStoreOption] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [dataTiendasOptions, setDataTiendasOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saleDataFormasPagos, setSaleDataFormasPagos] = useState(null); // Estado para los datos de formas de pago
  const [saleDataVentas, setSaleDataVentas] = useState(null); // Estado para los datos de ventas
  const [saleDataVentasPrevious, setSaleDataVentasPrevious] = useState(null); // Estado para los datos de ventas previas
  const [loadingSaleData, setLoadingSaleData] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    // Si es móvil, por defecto cerrado. Si es desktop, por defecto abierto.
    setIsOpen(!isMobile);
  }, [isMobile]);

  // Fetch tiendas data cuando carga la página
  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const response = await fetch("/api/leona/catalogos/tiendas");
        if (!response.ok) {
          throw new Error("Error al cargar las tiendas");
        }
        const data = await response.json();

        const tiendasOptions = data.Lista.map((tienda) => ({
          value: tienda.Codigo, // Suponiendo que la tienda tiene un id
          label: tienda.Descripcion, // Suponiendo que la tienda tiene un nombre
        }));
        setDataTiendasOptions(tiendasOptions);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching tiendas:", error);
        setLoading(false);
      }
    };

    fetchTiendas();
  }, []); // El array vacío hace que se ejecute solo una vez al montar el componente

  const dataOptions = [
    { value: "week", label: "Semanal" },
    { value: "month", label: "Mensual" },
    { value: "year", label: "Anual" },
  ];

  const handleApply = async () => {
    setLoadingSaleData(true); // Indicamos que comienza la carga

    try {
      // Variables para almacenar las fechas del período anterior según la opción seleccionada
      let startDatePrevious, endDatePrevious;
      let shouldCompare = false;

      if (compareOption === "week") {
        // Comparación intersemanal
        startDatePrevious = subWeeks(startDate, 1);
        endDatePrevious = subWeeks(endDate, 1);
        shouldCompare = true;
      } else if (compareOption === "month") {
        // Comparación intermensual
        startDatePrevious = subMonths(startDate, 1);
        endDatePrevious = subMonths(endDate, 1);
        shouldCompare = true;
      } else if (compareOption === "year") {
        // Comparación interanual
        startDatePrevious = subYears(startDate, 1);
        endDatePrevious = subYears(endDate, 1);
        shouldCompare = true;
      } else {
        // No hay opción de comparación seleccionada
        setSaleDataVentasPrevious(null);
      }

      // Consulta de resumen de cobranza (Período actual)
      const cobranzaResponse = await fetch(
        "/api/leona/consultastiendas/resumencobranza",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate,
            endDate,
          }),
        }
      );

      if (!cobranzaResponse.ok) {
        throw new Error("Error fetching cobranza data");
      }

      const cobranzaData = await cobranzaResponse.json();
      setSaleDataFormasPagos(cobranzaData.Cajas);

      // Consulta de ventas (Período actual)
      const ventasResponse = await fetch(
        "/api/leona/consultastiendas/variables",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate,
            endDate,
          }),
        }
      );

      if (!ventasResponse.ok) {
        throw new Error("Error fetching ventas data");
      }

      const ventasData = await ventasResponse.json();
      setSaleDataVentas(ventasData.Variables); // Asignamos los datos de ventas recibidos

      // Consulta de ventas (Período anterior) solo si hay opción de comparación
      if (shouldCompare) {
        const ventasResponsePrevious = await fetch(
          "/api/leona/consultastiendas/variables",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              startDate: startDatePrevious,
              endDate: endDatePrevious,
            }),
          }
        );

        if (!ventasResponsePrevious.ok) {
          throw new Error("Error fetching ventas data for previous period");
        }

        const ventasDataPrevious = await ventasResponsePrevious.json();
        setSaleDataVentasPrevious(ventasDataPrevious.Variables);
      } else {
        setSaleDataVentasPrevious(null);
      }

      setLoadingSaleData(false); // Finalizamos la carga
      setIsOpen(!isMobile);
    } catch (error) {
      console.error("Error fetching sales or cobranza data:", error);
      setLoadingSaleData(false); // Finalizamos la carga en caso de error
    }
  };

  const handleValueChangeComparative = (value) => {
    setCompareOption(value);
  };
  const handleValueChangeStore = (value) => {
    setStoreOption(value);
  };

  // Crear un mapa de los datos previos por Tienda
  const dataSalesPreviousMap = {};

  if (saleDataVentasPrevious) {
    saleDataVentasPrevious.forEach((item) => {
      dataSalesPreviousMap[item.Tienda] = item;
    });
  }

  // Unir los datos actuales con los previos
  let mergedData = [];

  if (saleDataVentas) {
    mergedData = saleDataVentas.map((currentItem) => {
      const previousItem = dataSalesPreviousMap[currentItem.Tienda] || {};

      return {
        ...currentItem,
        previousData: previousItem,
      };
    });
  }

  return (
    <div>
      <Card className="p-3 space-y-6 mb-2">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex justify-center md:hidden">
            <CollapsibleTrigger className="justify-items-center">
              <FilterIcon className="w-6 h-6" />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2">
            <div className="flex flex-col gap-4 w-full md:flex-row md:items-start">
              {/* DatePickers */}
              <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                <DatePicker
                  selectedDate={startDate}
                  onDateChange={setStartDate}
                  className="w-full md:w-auto"
                  title={"Desde"}
                />
                <DatePicker
                  selectedDate={endDate}
                  onDateChange={setEndDate}
                  className="w-full md:w-auto"
                  title={"Hasta"}
                />
                <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-4">
                  <Selecter
                    title={"Comparativa"}
                    dataOptions={dataOptions}
                    onValueChange={handleValueChangeComparative}
                  />
                </div>
                <div className="flex flex-col md:flex-row w-full md:w-full items-center gap-4">
                  {loading ? (
                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                  ) : (
                    <Selecter
                      title={"Tiendas"}
                      dataOptions={dataTiendasOptions}
                      onValueChange={handleValueChangeStore}
                    />
                  )}
                </div>
                {/* Botón Aplicar */}
                <div className="flex justify-end w-full">
                  <Button onClick={handleApply} className="w-full md:w-auto">
                    Aplicar
                  </Button>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Renderizamos el SaleReport condicionalmente */}
      {loadingSaleData ? (
        <div className="flex flex-col items-center justify-center space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl bg-white" />
        </div>
      ) : saleDataFormasPagos && saleDataVentas ? (
        <SaleReport
          dataFormasPagos={saleDataFormasPagos}
          mergedData={mergedData}
        />
      ) : (
        <div>No hay datos para mostrar. Por favor, aplica un filtro.</div>
      )}
    </div>
  );
}
