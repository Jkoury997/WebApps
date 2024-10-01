
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
