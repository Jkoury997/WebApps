const Attendance = require('../database/models/Attendance');
const WorkGroup = require('../database/models/WorkGroup');
const UserExtra = require('../database/models/UserExtra');
const { userDetails } = require('../utils/authUtils');

const obtenerDetalleAsistenciaPorDia = async (userId, fechaInicio, fechaFin) => {
    // Obtener datos básicos del usuario
    const user = await userDetails(userId);

    // Obtener el grupo de trabajo del usuario
    const userExtra = await UserExtra.findOne({ userId }).populate('workGroupId');
    if (!userExtra) {
        throw new Error('El usuario no tiene un grupo de trabajo asignado.');
    }

    const workGroup = userExtra.workGroupId;
    const horasAsignadas = workGroup.workHours;

    // Asegurar que las fechas se establezcan en el inicio y fin del día correspondiente
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    // Filtrar registros de asistencia para el usuario y el rango de fechas
    const asistencias = await Attendance.find({
        userId,
        timestamp: { $gte: inicio, $lte: fin },
    }).sort({ timestamp: 1 });

    // Agrupar registros por fecha y calcular métricas
    const detalleAsistencia = {};
    asistencias.forEach(asistencia => {
        const fecha = asistencia.timestamp.toISOString().split('T')[0]; // Formato YYYY-MM-DD

        if (!detalleAsistencia[fecha]) {
            detalleAsistencia[fecha] = {
                primeraEntrada: null,
                ultimaSalida: null,
                lugarEntrada: null,
                lugarSalida: null,
                horasTrabajadas: 0,
                horasAsignadas,
                salidaAutomatica: false, // Indicar si la última salida fue automática
                cumplimiento: false, // Indicador de cumplimiento de horas asignadas
            };
        }

        // Asignar primera entrada y lugar de entrada
        if (asistencia.type === 'entrada' && !detalleAsistencia[fecha].primeraEntrada) {
            detalleAsistencia[fecha].primeraEntrada = asistencia.timestamp;
            detalleAsistencia[fecha].lugarEntrada = asistencia.zoneId;
        }

        // Asignar última salida, lugar de salida y verificar si fue automática
        if (asistencia.type === 'salida') {
            if (
                !detalleAsistencia[fecha].ultimaSalida ||
                asistencia.timestamp > detalleAsistencia[fecha].ultimaSalida
            ) {
                detalleAsistencia[fecha].ultimaSalida = asistencia.timestamp;
                detalleAsistencia[fecha].lugarSalida = asistencia.zoneId;
                detalleAsistencia[fecha].salidaAutomatica = asistencia.automatic || false;
            }
        }
    });

    // Calcular horas trabajadas por día y verificar cumplimiento
    for (const fecha in detalleAsistencia) {
        const { primeraEntrada, ultimaSalida, horasAsignadas } = detalleAsistencia[fecha];

        if (primeraEntrada && ultimaSalida) {
            let horasTrabajadas;

            // Calcular diferencia si la salida es al día siguiente
            if (ultimaSalida > primeraEntrada) {
                horasTrabajadas = (ultimaSalida - primeraEntrada) / (1000 * 60 * 60); // Convertir a horas
            } else {
                // Si la salida es al día siguiente
                const finDia = new Date(primeraEntrada);
                finDia.setHours(23, 59, 59, 999);
                const inicioDiaSiguiente = new Date(ultimaSalida);
                inicioDiaSiguiente.setHours(0, 0, 0, 0);

                const horasPrimerDia = (finDia - primeraEntrada) / (1000 * 60 * 60);
                const horasDiaSiguiente = (ultimaSalida - inicioDiaSiguiente) / (1000 * 60 * 60);
                horasTrabajadas = horasPrimerDia + horasDiaSiguiente;
            }

            detalleAsistencia[fecha].horasTrabajadas = parseFloat(horasTrabajadas.toFixed(2)); // Redondear a 2 decimales
            detalleAsistencia[fecha].cumplimiento = horasTrabajadas >= horasAsignadas; // Verificar cumplimiento
        }
    }

    return detalleAsistencia;
};


// Obtener lugares frecuentes de entrada y salida para un usuario específico en un rango de fechas, incluyendo nombres de zona y sus IDs
const obtenerLugaresFrecuentes = async (userId, fechaInicio, fechaFin) => {
    // Asegurar que las fechas se establezcan en el inicio y fin del día correspondiente
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    // Filtrar registros de asistencia para el usuario en el rango de fechas y agrupar por zona de entrada y salida
    const lugaresFrecuentes = await Attendance.aggregate([
        { 
            $match: {
                userId,
                timestamp: { $gte: inicio, $lte: fin } // Filtrar por rango de fechas
            } 
        },
        { 
            $group: {
                _id: {
                    type: "$type",     // 'entrada' o 'salida'
                    zoneId: "$zoneId"  // Zona de la entrada o salida
                },
                frecuencia: { $sum: 1 } // Contar la frecuencia de cada combinación
            }
        },
        { $sort: { frecuencia: -1 } }, // Ordenar por frecuencia descendente
        {
            $lookup: {
                from: "zones",               // Nombre de la colección de zonas
                localField: "_id.zoneId",    // Campo de zoneId en la agrupación
                foreignField: "_id",         // Campo _id en la colección de Zones
                as: "zonaInfo"               // Nombre del campo de salida
            }
        },
        { $unwind: "$zonaInfo" } // Desenrollar el array zonaInfo para obtener el objeto
    ]);

    // Separar lugares frecuentes de entrada y salida
    const lugaresEntrada = [];
    const lugaresSalida = [];
    lugaresFrecuentes.forEach(lugar => {
        const { type } = lugar._id;
        const zoneData = {
            id: lugar._id.zoneId,                // ID de la zona
            nombre: lugar.zonaInfo.nombre,       // Nombre de la zona
            frecuencia: lugar.frecuencia         // Frecuencia de entradas o salidas
        };

        if (type === 'entrada') {
            lugaresEntrada.push(zoneData);
        } else if (type === 'salida') {
            lugaresSalida.push(zoneData);
        }
    });

    return { lugaresEntrada, lugaresSalida };
};


const obtenerEstadisticasTrabajo = async (userId, fechaInicio, fechaFin) => {
    // Asegurar que las fechas se establezcan en el inicio y fin del día correspondiente
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    console.log(`Obteniendo estadísticas para userId: ${userId}, desde ${inicio} hasta ${fin}`);

    // Filtrar registros de asistencia para el usuario en el rango de fechas y agrupar solo por día
    const asistenciaPorDia = await Attendance.aggregate([
        {
            $match: {
                userId,
                timestamp: { $gte: inicio, $lte: fin }
            }
        },
        {
            $group: {
                _id: { dia: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } } }, // Agrupar solo por día
                primeraEntrada: { $min: { $cond: [{ $eq: ["$type", "entrada"] }, "$timestamp", null] } },
                ultimaSalida: { $max: { $cond: [{ $eq: ["$type", "salida"] }, "$timestamp", null] } }
            }
        }
    ]);

    // Variables para acumular estadísticas
    let diasTrabajados = 0;
    let horasTotales = 0;

    asistenciaPorDia.forEach(dia => {
        const { primeraEntrada, ultimaSalida } = dia;
        if (primeraEntrada && ultimaSalida) {
            // Calcular horas trabajadas en el día
            const horasTrabajadasDia = (ultimaSalida - primeraEntrada) / (1000 * 60 * 60);
            horasTotales += horasTrabajadasDia;
            diasTrabajados++;
        }
    });

    // Calcular el promedio de horas trabajadas por día
    const horasPromedio = diasTrabajados > 0 ? (horasTotales / diasTrabajados).toFixed(2) : 0;


    return {
        diasTrabajados,
        horasTotales: horasTotales.toFixed(2),
        horasPromedio
    };
};

// Obtener movimientos entre zonas para un usuario en un rango de fechas
const obtenerMovimientosEntreZonas = async (userId, fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    // Filtrar registros de asistencia para el usuario en el rango de fechas y ordenarlos cronológicamente
    const asistencias = await Attendance.aggregate([
        { 
            $match: {
                userId,
                timestamp: { $gte: inicio, $lte: fin }
            }
        },
        { $sort: { timestamp: 1 } }, // Ordenar cronológicamente
        {
            $lookup: {
                from: "zones",             // Nombre de la colección de zonas
                localField: "zoneId",      // Campo zoneId en Attendance
                foreignField: "_id",       // Campo _id en Zones
                as: "zonaInfo"             // Salida del campo con la información de la zona
            }
        },
        { $unwind: "$zonaInfo" }         // Desenrollar el array zonaInfo para obtener un objeto
    ]);

    const movimientos = [];
    for (let i = 0; i < asistencias.length - 1; i++) {
        // Verificar que se trate de un movimiento entre una salida y la siguiente entrada
        if (asistencias[i].type === 'salida' && asistencias[i + 1].type === 'entrada') {
            const ruta = {
                zonaSalida: {
                    id: asistencias[i].zonaInfo._id,
                    nombre: asistencias[i].zonaInfo.nombre
                },
                zonaEntrada: {
                    id: asistencias[i + 1].zonaInfo._id,
                    nombre: asistencias[i + 1].zonaInfo.nombre
                },
                tiempoDesplazamiento: (asistencias[i + 1].timestamp - asistencias[i].timestamp) / (1000 * 60) // En minutos
            };
            movimientos.push(ruta);
        }
    }

    // Contabilizar la frecuencia de cada ruta y calcular tiempo promedio de desplazamiento
    const frecuenciaRutas = {};
    movimientos.forEach(movimiento => {
        const rutaKey = `${movimiento.zonaSalida.nombre} -> ${movimiento.zonaEntrada.nombre}`;
        
        if (frecuenciaRutas[rutaKey]) {
            // Acumular tiempos de desplazamiento y aumentar la frecuencia
            frecuenciaRutas[rutaKey].tiempoDesplazamientoTotal += movimiento.tiempoDesplazamiento;
            frecuenciaRutas[rutaKey].frecuencia++;
        } else {
            // Inicializar un nuevo registro de ruta
            frecuenciaRutas[rutaKey] = { 
                ...movimiento, 
                tiempoDesplazamientoTotal: movimiento.tiempoDesplazamiento, 
                frecuencia: 1 
            };
        }
    });

    // Calcular el tiempo promedio de desplazamiento para cada ruta
    const resultado = Object.values(frecuenciaRutas).map(ruta => ({
        zonaSalida: ruta.zonaSalida,
        zonaEntrada: ruta.zonaEntrada,
        tiempoDesplazamientoPromedio: (ruta.tiempoDesplazamientoTotal / ruta.frecuencia).toFixed(2), // Promedio en minutos
        frecuencia: ruta.frecuencia
    }));

    return resultado;
};

const obtenerTurnosIrregulares = async (userId, fechaInicio, fechaFin, horaInicio, horaFin, toleranciaMinutos = 15) => {
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    const asistenciaPorDia = await Attendance.aggregate([
        {
            $match: {
                userId,
                timestamp: { $gte: inicio, $lte: fin }
            }
        },
        {
            $group: {
                _id: { dia: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } } },
                primeraEntrada: { $min: { $cond: [{ $eq: ["$type", "entrada"] }, "$timestamp", null] } },
                ultimaSalida: { $max: { $cond: [{ $eq: ["$type", "salida"] }, "$timestamp", null] } }
            }
        }
    ]);

    const diasIrregulares = asistenciaPorDia
        .filter(dia => {
            const { primeraEntrada, ultimaSalida } = dia;
            if (!primeraEntrada || !ultimaSalida) return false;

            const entradaHora = primeraEntrada.getHours();
            const entradaMinuto = primeraEntrada.getMinutes();
            const salidaHora = ultimaSalida.getHours();
            const salidaMinuto = ultimaSalida.getMinutes();

            dia.motivo = [];

            // Convertir tiempos a minutos para simplificar la comparación
            const entradaActual = entradaHora * 60 + entradaMinuto;
            const salidaActual = salidaHora * 60 + salidaMinuto;
            const entradaLimiteMin = horaInicio * 60;  // Hora de entrada en minutos
            const entradaLimiteMax = entradaLimiteMin + toleranciaMinutos;  // Hora de entrada + tolerancia
            const salidaLimiteMin = horaFin * 60 - toleranciaMinutos;  // Hora de salida - tolerancia
            const salidaLimiteMax = horaFin * 60;  // Hora de salida en minutos

            // Lógica de entrada con tolerancia
            if (entradaActual < entradaLimiteMin) {
                dia.motivo.push("entrada temprana");
            } else if (entradaActual <= entradaLimiteMax) {
                dia.motivo.push("entrada dentro de tolerancia");
            } else {
                dia.motivo.push("entrada tardía");
            }

            // Lógica de salida con tolerancia
            if (salidaActual < salidaLimiteMin) {
                dia.motivo.push("salida temprana");
            } else if (salidaActual <= salidaLimiteMax) {
                dia.motivo.push("salida dentro de tolerancia");
            } else {
                dia.motivo.push("salida tardía");
            }

            return dia.motivo.length > 0; // Incluir siempre días con algún motivo
        })
        .map(dia => ({
            fecha: dia._id.dia,
            entrada: dia.primeraEntrada 
                ? new Date(dia.primeraEntrada).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Argentina/Buenos_Aires" }) 
                : null,
            salida: dia.ultimaSalida 
                ? new Date(dia.ultimaSalida).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Argentina/Buenos_Aires" }) 
                : null,
            motivo: dia.motivo
        }));

    return diasIrregulares;
};




const obtenerTiempoEnZonas = async (userId, fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    // Filtrar registros de asistencia para el usuario en el rango de fechas y ordenarlos cronológicamente
    const asistencias = await Attendance.aggregate([
        { 
            $match: {
                userId,
                timestamp: { $gte: inicio, $lte: fin }
            }
        },
        { $sort: { timestamp: 1 } }, // Ordenar cronológicamente
        {
            $lookup: {
                from: "zones",             // Nombre de la colección de zonas
                localField: "zoneId",      // Campo zoneId en Attendance
                foreignField: "_id",       // Campo _id en Zones
                as: "zonaInfo"             // Salida del campo con la información de la zona
            }
        },
        { $unwind: "$zonaInfo" }         // Desenrollar el array zonaInfo para obtener un objeto
    ]);

    const tiempoPorZona = {};

    for (let i = 0; i < asistencias.length - 1; i++) {
        // Identificar una estancia en la misma zona (entrada y salida consecutivos)
        if (asistencias[i].type === 'entrada' && asistencias[i + 1].type === 'salida' && asistencias[i].zoneId === asistencias[i + 1].zoneId) {
            const zonaId = asistencias[i].zoneId;
            const zonaNombre = asistencias[i].zonaInfo.nombre;

            // Calcular tiempo de permanencia en minutos
            const tiempoEstadia = (asistencias[i + 1].timestamp - asistencias[i].timestamp) / (1000 * 60 *60);

            if (tiempoPorZona[zonaId]) {
                tiempoPorZona[zonaId].tiempoTotal += tiempoEstadia;
                tiempoPorZona[zonaId].frecuencia++;
            } else {
                tiempoPorZona[zonaId] = {
                    nombre: zonaNombre,
                    tiempoTotal: tiempoEstadia,
                    frecuencia: 1
                };
            }
        }
    }

    // Convertir el objeto en un array para una salida estructurada
    const resultado = Object.keys(tiempoPorZona).map(zonaId => ({
        zonaId,
        nombre: tiempoPorZona[zonaId].nombre,
        tiempoTotal: tiempoPorZona[zonaId].tiempoTotal.toFixed(2), // Tiempo total en minutos, redondeado
        frecuencia: tiempoPorZona[zonaId].frecuencia
    }));

    return resultado;
};


module.exports = {
    obtenerDetalleAsistenciaPorDia,
    obtenerLugaresFrecuentes,
    obtenerEstadisticasTrabajo,
    obtenerMovimientosEntreZonas,
    obtenerTurnosIrregulares,
    obtenerTiempoEnZonas
};
