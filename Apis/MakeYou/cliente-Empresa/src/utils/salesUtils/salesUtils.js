// utils.js

// Función para calcular la variación porcentual entre dos valores
export function calcularVariacion(actual, previo) {
  if (previo === 0 || isNaN(actual) || isNaN(previo)) return "N/A";
  const variacion = ((actual - previo) / previo) * 100;
  return variacion.toFixed(2);
}

// Función para formatear números como moneda en pesos argentinos
export function Pesos(numero) {
  if (isNaN(numero)) {
    return "N/A";
  }

  return numero.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2, // Para mostrar 2 decimales
  });
}

// Función para filtrar tiendas excluidas
function filtrarTiendas(data) {
  const tiendasExcluir = [
    "MercadoLibre",
    "Venta por Fabrica",
    "On Line Web",
    "Comercios",
    "Total",
  ];

  return (
    data?.filter((item) => {
      const tiendaNombre = item.Tienda?.toLowerCase();
      const excluir =
        tiendasExcluir.some(
          (tienda) => tienda.toLowerCase() === tiendaNombre
        ) ||
        tiendaNombre.includes("total") ||
        Number(item.Bruto) === 0; // Excluir si Bruto es 0
      return !excluir;
    }) || []
  );
}



// Función para filtrar tiendas excluidas
function filtrarCajasTiendas(data) {
  const tiendasExcluir = [
    "MercadoLibre",
    "Venta por Fabrica",
    "On Line Web",
    "Comercios",
    "Total",
  ];

  return (
    data?.filter((item) => {
      const tiendaNombre = item.Tienda?.toLowerCase();
      const excluir =
        tiendasExcluir.some(
          (tienda) => tienda.toLowerCase() === tiendaNombre
        ) ||
        tiendaNombre.includes("feria")
      return !excluir;
    }) || []
  );
}

// Función para filtrar y solo incluir las tiendas especificadas
function filtrarWeb(data) {
  const tiendasIncluir = [
    "MercadoLibre",
    "Venta por Fabrica",
    "On Line Web",
    "Comercios",
  ];

  return (
    data?.filter((item) => {
      const tiendaNombre = item.Tienda?.toLowerCase();
      const incluir =
        tiendasIncluir.some(
          (tienda) => tienda.toLowerCase() === tiendaNombre
        );
      return incluir && Number(item.Bruto) !== 0; // Incluir si está en la lista y Bruto no es 0
    }) || []
  );
}



// Función para filtrar y solo incluir las tiendas especificadas
function filtrarCajasWeb(data) {
  const tiendasIncluir = [
    "MercadoLibre",
    "Venta por Fabrica",
    "On Line Web",
    "Comercios",
  ];

  return (
    data?.filter((item) => {
      const tiendaNombre = item.Tienda?.toLowerCase();
      const incluir =
        tiendasIncluir.some(
          (tienda) => tienda.toLowerCase() === tiendaNombre
        );
      return incluir && Number(item.Bruto) !== 0; // Incluir si está en la lista y Bruto no es 0
    }) || []
  );
}


// Función para calcular totales y promedios
export function calcularTotalesYPromedios(mergedData) {
  // Filtrar las tiendas
  const MerdataTiendas = filtrarTiendas(mergedData);

  // Inicializar acumuladores
  let totalBruto = 0;
  let totalNeto = 0;
  let totalTickets = 0;
  let totalUnidades = 0;
  let totalCMV = 0;
  let totalCAT = 0;
  let totalPP = 0;
  let totalTP = 0;

  let totalBrutoPrevio = 0;
  let totalNetoPrevio = 0;
  let totalTicketsPrevio = 0;
  let totalUnidadesPrevio = 0;
  let totalCMVPrevio = 0;
  let totalCATPrevio = 0;
  let totalPPPrevio = 0;
  let totalTPPrevio = 0;

  const numTiendas = MerdataTiendas.length;

  // Recorrer MerdataTiendas y acumular valores
  MerdataTiendas.forEach((item) => {
    // Valores actuales
    totalBruto += Number(item.Bruto) || 0;
    totalNeto += Number(item.Neto) || 0;
    totalTickets += Number(item.Tickets) || 0;
    totalUnidades += Number(item.Unidades) || 0;
    totalCMV += Number(item.CMV) || 0;
    totalCAT += Number(item.CAT) || 0;
    totalPP += Number(item.PP) || 0;
    totalTP += Number(item.TP) || 0;

    // Valores previos
    totalBrutoPrevio += Number(item.previousData.Bruto) || 0;
    totalNetoPrevio += Number(item.previousData.Neto) || 0;
    totalTicketsPrevio += Number(item.previousData.Tickets) || 0;
    totalUnidadesPrevio += Number(item.previousData.Unidades) || 0;
    totalCMVPrevio += Number(item.previousData.CMV) || 0;
    totalCATPrevio += Number(item.previousData.CAT) || 0;
    totalPPPrevio += Number(item.previousData.PP) || 0;
    totalTPPrevio += Number(item.previousData.TP) || 0;
  });

  // Calcular promedios
  const promedioCAT = numTiendas > 0 ? totalCAT / numTiendas : 0;
  const promedioPP = numTiendas > 0 ? totalPP / numTiendas : 0;
  const promedioTP = numTiendas > 0 ? totalTP / numTiendas : 0;

  const promedioCATPrevio = numTiendas > 0 ? totalCATPrevio / numTiendas : 0;
  const promedioPPPrevio = numTiendas > 0 ? totalPPPrevio / numTiendas : 0;
  const promedioTPPrevio = numTiendas > 0 ? totalTPPrevio / numTiendas : 0;

  // Crear el objeto total
  const totalItem = {
    Tienda: "Total",
    Bruto: totalBruto,
    Neto: totalNeto,
    Tickets: totalTickets,
    Unidades: totalUnidades,
    CMV: totalCMV,
    CAT: promedioCAT,
    PP: promedioPP,
    TP: promedioTP,
    previousData: {
      Bruto: totalBrutoPrevio,
      Neto: totalNetoPrevio,
      Tickets: totalTicketsPrevio,
      Unidades: totalUnidadesPrevio,
      CMV: totalCMVPrevio,
      CAT: promedioCATPrevio,
      PP: promedioPPPrevio,
      TP: promedioTPPrevio,
    },
  };

  // Agregar el total a MerdataTiendas
  MerdataTiendas.push(totalItem);

  return MerdataTiendas;
}


// Función para calcular Cajas
export function calcularCajasTotales(data) {
  // Filtrar las tiendas
  const dataTiendas = filtrarCajasTiendas(data);
  // Inicializar acumuladores
  let Total = 0;
  let Punto1 = 0;
  let Punto2 = 0;
  let Efectivo = 0;
  let Tarjeta01 = 0;
  let Tarjeta02 = 0;
  let Tarjeta03 = 0;
  let Tarjeta06 = 0;
  let Tarjeta12 = 0;
  let Bancos = 0;

  // Recorrer dataTiendas y acumular valores
  dataTiendas.forEach((item) => {
    Total += Number(item.Total) || 0;
    Punto1 += Number(item.Punto1) || 0;
    Punto2 += Number(item.Punto2) || 0;
    Efectivo += Number(item.Efectivo) || 0;
    Tarjeta01 += Number(item.Tarjeta01) || 0;
    Tarjeta02 += Number(item.Tarjeta02) || 0;
    Tarjeta03 += Number(item.Tarjeta03) || 0;
    Tarjeta06 += Number(item.Tarjeta06) || 0;
    Tarjeta12 += Number(item.Tarjeta12) || 0;
    Bancos += Number(item.Bancos) || 0;
  });

  // Crear el objeto total con los acumuladores
  const totalItem = {
    Total,
    Punto1,
    Punto2,
    Efectivo,
    Tarjeta01,
    Tarjeta02,
    Tarjeta03,
    Tarjeta06,
    Tarjeta12,
    Bancos,
  };

  return totalItem;
}


// Función para calcular totales y promedios
export function calcularTotalesYPromediosWeb(mergedData) {
  // Filtrar las tiendas
  const MerdataTiendas = filtrarWeb(mergedData);

  // Inicializar acumuladores
  let totalBruto = 0;
  let totalNeto = 0;
  let totalTickets = 0;
  let totalUnidades = 0;
  let totalCMV = 0;
  let totalCAT = 0;
  let totalPP = 0;
  let totalTP = 0;

  let totalBrutoPrevio = 0;
  let totalNetoPrevio = 0;
  let totalTicketsPrevio = 0;
  let totalUnidadesPrevio = 0;
  let totalCMVPrevio = 0;
  let totalCATPrevio = 0;
  let totalPPPrevio = 0;
  let totalTPPrevio = 0;

  const numTiendas = MerdataTiendas.length;

  // Recorrer MerdataTiendas y acumular valores
  MerdataTiendas.forEach((item) => {
    // Valores actuales
    totalBruto += Number(item.Bruto) || 0;
    totalNeto += Number(item.Neto) || 0;
    totalTickets += Number(item.Tickets) || 0;
    totalUnidades += Number(item.Unidades) || 0;
    totalCMV += Number(item.CMV) || 0;
    totalCAT += Number(item.CAT) || 0;
    totalPP += Number(item.PP) || 0;
    totalTP += Number(item.TP) || 0;

    // Valores previos
    totalBrutoPrevio += Number(item.previousData.Bruto) || 0;
    totalNetoPrevio += Number(item.previousData.Neto) || 0;
    totalTicketsPrevio += Number(item.previousData.Tickets) || 0;
    totalUnidadesPrevio += Number(item.previousData.Unidades) || 0;
    totalCMVPrevio += Number(item.previousData.CMV) || 0;
    totalCATPrevio += Number(item.previousData.CAT) || 0;
    totalPPPrevio += Number(item.previousData.PP) || 0;
    totalTPPrevio += Number(item.previousData.TP) || 0;
  });

  // Calcular promedios
  const promedioCAT = numTiendas > 0 ? totalCAT / numTiendas : 0;
  const promedioPP = numTiendas > 0 ? totalPP / numTiendas : 0;
  const promedioTP = numTiendas > 0 ? totalTP / numTiendas : 0;

  const promedioCATPrevio = numTiendas > 0 ? totalCATPrevio / numTiendas : 0;
  const promedioPPPrevio = numTiendas > 0 ? totalPPPrevio / numTiendas : 0;
  const promedioTPPrevio = numTiendas > 0 ? totalTPPrevio / numTiendas : 0;

  // Crear el objeto total
  const totalItem = {
    Tienda: "Total",
    Bruto: totalBruto,
    Neto: totalNeto,
    Tickets: totalTickets,
    Unidades: totalUnidades,
    CMV: totalCMV,
    CAT: promedioCAT,
    PP: promedioPP,
    TP: promedioTP,
    previousData: {
      Bruto: totalBrutoPrevio,
      Neto: totalNetoPrevio,
      Tickets: totalTicketsPrevio,
      Unidades: totalUnidadesPrevio,
      CMV: totalCMVPrevio,
      CAT: promedioCATPrevio,
      PP: promedioPPPrevio,
      TP: promedioTPPrevio,
    },
  };

  // Agregar el total a MerdataTiendas
  MerdataTiendas.push(totalItem);

  return MerdataTiendas;
}


// Función para calcular Cajas
export function calcularCajasTotalesWeb(data) {
  // Filtrar las tiendas
  const dataTiendas = filtrarCajasWeb(data);

  // Inicializar acumuladores
  let Total = 0;
  let Punto1 = 0;
  let Punto2 = 0;
  let Efectivo = 0;
  let Tarjeta01 = 0;
  let Tarjeta02 = 0;
  let Tarjeta03 = 0;
  let Tarjeta06 = 0;
  let Tarjeta12 = 0;
  let Bancos = 0;

  // Recorrer dataTiendas y acumular valores
  dataTiendas.forEach((item) => {
    Total += Number(item.Total) || 0;
    Punto1 += Number(item.Punto1) || 0;
    Punto2 += Number(item.Punto2) || 0;
    Efectivo += Number(item.Efectivo) || 0;
    Tarjeta01 += Number(item.Tarjeta01) || 0;
    Tarjeta02 += Number(item.Tarjeta02) || 0;
    Tarjeta03 += Number(item.Tarjeta03) || 0;
    Tarjeta06 += Number(item.Tarjeta06) || 0;
    Tarjeta12 += Number(item.Tarjeta12) || 0;
    Bancos += Number(item.Bancos) || 0;
  });

  // Crear el objeto total con los acumuladores
  const totalItem = {
    Total,
    Punto1,
    Punto2,
    Efectivo,
    Tarjeta01,
    Tarjeta02,
    Tarjeta03,
    Tarjeta06,
    Tarjeta12,
    Bancos,
  };

  return totalItem;
}

