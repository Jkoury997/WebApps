import { DollarSign, Users, Activity, BoxIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import CajasReport from "./caja-report";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardResumen from "./sale/card-resumen";
import TableResumen from "./sale/table-resumen";
import {
  calcularCajasTotales,
  calcularCajasTotalesWeb,
  calcularTotalesYPromedios,
  calcularTotalesYPromediosWeb,
  Pesos,calcularVariacion,
  calcularCajasTotalesVentasTotales,
  calcularTotalesYPromediosVentasTotales
} from "@/utils/salesUtils/salesUtils";



export default function SaleReport({ dataFormasPagos, mergedData }) {
  // Calcular los totales de las cajas
  const CajasTotalesTiendas = calcularCajasTotales(dataFormasPagos);
  
  // Calcula los totales y promedios
  const dataMergeTiendas = calcularTotalesYPromedios(mergedData);

 
  

  // Extraer el elemento total del dataMerge
  const totalItemTiendas = dataMergeTiendas.find((item) => item.Tienda === "Total");

  // Verificar que totalItemTiendas existe
  if (!totalItemTiendas) {
    console.error("No se encontró el elemento total en dataMerge");
  }

  // Mostrar variaciones en las tarjetas
  const data = [
    {
      title: "Ventas Totales",
      value: Pesos(totalItemTiendas.Bruto),
      percentage: calcularVariacion(
        totalItemTiendas.Bruto,
        totalItemTiendas.previousData.Bruto
      ),
      icon: DollarSign,
      id: "dashboard-01-chunk-0",
    },
    {
      title: "Tickets",
      value: totalItemTiendas.Tickets,
      percentage: calcularVariacion(
        totalItemTiendas.Tickets,
        totalItemTiendas.previousData.Tickets
      ),
      icon: Users,
      id: "dashboard-01-chunk-1",
    },
    {
      title: "Unidades",
      value: totalItemTiendas.Unidades,
      percentage: calcularVariacion(
        totalItemTiendas.Unidades,
        totalItemTiendas.previousData.Unidades
      ),
      icon: BoxIcon,
      id: "dashboard-01-chunk-2",
    },
    {
      title: "Reseñas",
      value: "En construcción",
      percentage: "0",
      icon: Activity,
      id: "dashboard-01-chunk-3",
    },
  ];

  // Mostrar variaciones en la tabla
  const tableData = [
    {
      variable: "CAT",
      monto: totalItemTiendas.CAT.toFixed(2), // Promedio con dos decimales
      variacion: calcularVariacion(totalItemTiendas.CAT, totalItemTiendas.previousData.CAT),
    },
    {
      variable: "PP",
      monto: Pesos(totalItemTiendas.PP),
      variacion: calcularVariacion(totalItemTiendas.PP, totalItemTiendas.previousData.PP),
    },
    {
      variable: "TP",
      monto: Pesos(totalItemTiendas.TP),
      variacion: calcularVariacion(totalItemTiendas.TP, totalItemTiendas.previousData.TP),
    },
    {
      variable: "CMV",
      monto: Pesos(totalItemTiendas.CMV),
      variacion: calcularVariacion(totalItemTiendas.CMV, totalItemTiendas.previousData.CMV),
    },
  ];


    // Calcular los totales de las cajas
    const CajasTotalesWeb = calcularCajasTotalesWeb(dataFormasPagos);

    // Calcula los totales y promedios
    const dataMergeWeb = calcularTotalesYPromediosWeb(mergedData);

    // Extraer el elemento total del dataMerge
    const totalItemWeb = dataMergeWeb.find((item) => item.Tienda === "Total");

    // Verificar que totalItemTiendas existe
    if (!totalItemWeb) {
      console.error("No se encontró el elemento total en dataMerge");
    }
  
    // Mostrar variaciones en las tarjetas
    const dataWeb = [
      {
        title: "Ventas Totales",
        value: Pesos(totalItemWeb.Bruto),
        percentage: calcularVariacion(
          totalItemWeb.Bruto,
          totalItemWeb.previousData.Bruto
        ),
        icon: DollarSign,
        id: "dashboard-01-chunk-0",
      },
      {
        title: "Tickets",
        value: totalItemWeb.Tickets,
        percentage: calcularVariacion(
          totalItemWeb.Tickets,
          totalItemWeb.previousData.Tickets
        ),
        icon: Users,
        id: "dashboard-01-chunk-1",
      },
      {
        title: "Unidades",
        value: totalItemWeb.Unidades,
        percentage: calcularVariacion(
          totalItemWeb.Unidades,
          totalItemWeb.previousData.Unidades
        ),
        icon: BoxIcon,
        id: "dashboard-01-chunk-2",
      },
      {
        title: "Reseñas",
        value: "En construcción",
        percentage: "0",
        icon: Activity,
        id: "dashboard-01-chunk-3",
      },
    ];
  
    // Mostrar variaciones en la tabla
    const tableDataWeb = [
      {
        variable: "CAT",
        monto: totalItemWeb.CAT.toFixed(2), // Promedio con dos decimales
        variacion: calcularVariacion(totalItemWeb.CAT, totalItemWeb.previousData.CAT),
      },
      {
        variable: "PP",
        monto: Pesos(totalItemWeb.PP),
        variacion: calcularVariacion(totalItemWeb.PP, totalItemWeb.previousData.PP),
      },
      {
        variable: "TP",
        monto: Pesos(totalItemWeb.TP),
        variacion: calcularVariacion(totalItemWeb.TP, totalItemWeb.previousData.TP),
      },
      {
        variable: "CMV",
        monto: Pesos(totalItemWeb.CMV),
        variacion: calcularVariacion(totalItemWeb.CMV, totalItemWeb.previousData.CMV),
      },
    ];


      // Calcular los totales de las cajas
      const CajasTotalesVentasTotales = calcularCajasTotalesVentasTotales(dataFormasPagos);

      // Calcula los totales y promedios
      const dataMergeVentasTotales = calcularTotalesYPromediosVentasTotales(mergedData);
  
      // Extraer el elemento total del dataMerge
      const totalItemVentasTotales = dataMergeVentasTotales.find((item) => item.Tienda === "Total");
  
      // Verificar que totalItemTiendas existe
      if (!totalItemVentasTotales) {
        console.error("No se encontró el elemento total en dataMerge");
      }
    
     // Mostrar variaciones en las tarjetas
     const dataVentaTotales = [
      {
        title: "Ventas Totales",
        value: Pesos(totalItemVentasTotales.Bruto),
        percentage: calcularVariacion(
          totalItemVentasTotales.Bruto,
          totalItemVentasTotales.previousData.Bruto
        ),
        icon: DollarSign,
        id: "dashboard-01-chunk-0",
      },
      {
        title: "Tickets",
        value: totalItemVentasTotales.Tickets,
        percentage: calcularVariacion(
          totalItemVentasTotales.Tickets,
          totalItemVentasTotales.previousData.Tickets
        ),
        icon: Users,
        id: "dashboard-01-chunk-1",
      },
      {
        title: "Unidades",
        value: totalItemVentasTotales.Unidades,
        percentage: calcularVariacion(
          totalItemVentasTotales.Unidades,
          totalItemVentasTotales.previousData.Unidades
        ),
        icon: BoxIcon,
        id: "dashboard-01-chunk-2",
      },
      {
        title: "Reseñas",
        value: "En construcción",
        percentage: "0",
        icon: Activity,
        id: "dashboard-01-chunk-3",
      },
    ];
  
    // Mostrar variaciones en la tabla
    const tableDataVentaTotales = [
      {
        variable: "CAT",
        monto: totalItemVentasTotales.CAT.toFixed(2), // Promedio con dos decimales
        variacion: calcularVariacion(totalItemVentasTotales.CAT, totalItemVentasTotales.previousData.CAT),
      },
      {
        variable: "PP",
        monto: Pesos(totalItemVentasTotales.PP),
        variacion: calcularVariacion(totalItemVentasTotales.PP, totalItemVentasTotales.previousData.PP),
      },
      {
        variable: "TP",
        monto: Pesos(totalItemVentasTotales.TP),
        variacion: calcularVariacion(totalItemVentasTotales.TP, totalItemVentasTotales.previousData.TP),
      },
      {
        variable: "CMV",
        monto: Pesos(totalItemVentasTotales.CMV),
        variacion: calcularVariacion(totalItemVentasTotales.CMV, totalItemVentasTotales.previousData.CMV),
      },
    ];

  return (
    <>
      <Tabs defaultValue="store" className="w-full text-center">
        <TabsList>
          <TabsTrigger value="store">Tiendas</TabsTrigger>
          <TabsTrigger value="web">Web</TabsTrigger>
          <TabsTrigger value="totales">Totales</TabsTrigger>

        </TabsList>
         {/* TIENDAS */}
        <TabsContent value="store">
          <div className="space-y-5">
            <CardResumen data={data}></CardResumen>
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-2 mt-1">
              <TableResumen data={tableData}></TableResumen>
              {/* Segunda tarjeta */}
              <CajasReport dataCaja={CajasTotalesTiendas} />
            </div>
          </div>
        </TabsContent>
        {/* WEB */}
        <TabsContent value="web">
          <div className="space-y-5">
            <CardResumen data={dataWeb}></CardResumen>

            {/* Tabla de transacciones */}
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-2 mt-1">
              <TableResumen data={tableDataWeb} ></TableResumen>
              {/* Segunda tarjeta */}
              <CajasReport dataCaja={CajasTotalesWeb} />
            </div>
          </div>
        </TabsContent>
         {/* Totales */}
         <TabsContent value="totales">
          <div className="space-y-5">
            <CardResumen data={dataVentaTotales}></CardResumen>

            {/* Tabla de transacciones */}
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-2 mt-1">
              <TableResumen data={tableDataVentaTotales} ></TableResumen>
              {/* Segunda tarjeta */}
              <CajasReport dataCaja={CajasTotalesVentasTotales} />
            </div>
          </div>
        </TabsContent>
        

      </Tabs>
    </>
  );
}
