const Attendance = require('../database/models/Attendance');
const { userByEmpresa, userDetails } = require('../utils/authUtils');
require('../utils/dateUtils'); // Asegúrate de ajustar la ruta según la ubicación del archivo



// Contar total de fichadas para una empresa específica
const obtenerTotalFichadas = async (empresaId) => {
    const users = await userByEmpresa(empresaId);
    const userIds = users.map(user => user._id);
    return await Attendance.countDocuments({ userId: { $in: userIds } });
};

// Contar asistencia diaria para una empresa en una fecha específica
const obtenerAsistenciaDiaria = async (empresaId, fecha) => {
    const users = await userByEmpresa(empresaId);
    const userIds = users.map(user => user._id);
    return await Attendance.countDocuments({
        userId: { $in: userIds },
        timestamp: {
            $gte: new Date(fecha.setHours(0, 0, 0, 0)),
            $lt: new Date(fecha.setHours(23, 59, 59, 999))
        }
    });
};

// Contar asistencia semanal para una empresa en un rango de fechas
const obtenerAsistenciaSemanal = async (empresaId, fechaInicioSemana, fechaFinSemana) => {
    const users = await userByEmpresa(empresaId);
    const userIds = users.map(user => user._id);
    return await Attendance.countDocuments({
        userId: { $in: userIds },
        timestamp: {
            $gte: fechaInicioSemana,
            $lt: fechaFinSemana
        }
    });
};

// Contar asistencia mensual para una empresa en un mes y año específicos
const obtenerAsistenciaMensual = async (empresaId, mes, anio) => {
    const users = await userByEmpresa(empresaId);
    const userIds = users.map(user => user._id);
    const inicioMes = new Date(anio, mes - 1, 1);
    const finMes = new Date(anio, mes, 0, 23, 59, 59, 999);
    return await Attendance.countDocuments({
        userId: { $in: userIds },
        timestamp: {
            $gte: inicioMes,
            $lt: finMes
        }
    });
};

// Fichadas agrupadas por zona para todos los usuarios
const obtenerFichadasPorZona = async () => {
    return await Attendance.aggregate([
        { $group: { _id: "$zoneId", totalFichadas: { $sum: 1 } } },
        { $sort: { totalFichadas: -1 } }
    ]);
};

// Horario pico de fichadas (hora más frecuentada)
const obtenerHorarioPico = async () => {
    return await Attendance.aggregate([
        { $project: { hora: { $hour: "$timestamp" } } },
        { $group: { _id: "$hora", totalFichadas: { $sum: 1 } } },
        { $sort: { totalFichadas: -1 } },
        { $project: { hora: "$_id", totalFichadas: 1, _id: 0 } } // Renombrar `_id` a `hora`
    ]);
};


// Calcular tiempo promedio entre entradas y salidas para un usuario específico
const obtenerTiempoEstadiaPromedio = async (userId) => {
    const asistencias = await Attendance.find({ userId }).sort({ timestamp: 1 });
    let totalTiempo = 0;
    let entradas = 0;

    for (let i = 0; i < asistencias.length - 1; i++) {
        if (asistencias[i].type === 'entrada' && asistencias[i + 1].type === 'salida') {
            const tiempoEstadia = asistencias[i + 1].timestamp - asistencias[i].timestamp;
            totalTiempo += tiempoEstadia;
            entradas++;
        }
    }

    return entradas > 0 ? (totalTiempo / entradas) / 1000 / 60 : 0; // en minutos
};

// Función principal para generar el reporte completo del empleado
const generarSuperReporteEmpleado = async (userId) => {
    try {
        // 1. Obtener datos básicos del empleado
        const user = await userDetails(userId);

        // 2. Obtener métricas de asistencia
        const totalFichadas = await Attendance.countDocuments({ userId });
        const asistenciaDiaria = await calcularPromedioAsistenciaDiaria(userId);
        const asistenciaSemanal = await calcularPromedioAsistenciaSemanal(userId);
        const asistenciaMensual = await calcularAsistenciaMensual(userId);

        // 3. Obtener patrones de entrada y salida
        const horaEntradaPromedio = await obtenerHoraPromedioEntrada(userId);
        const horaSalidaPromedio = await obtenerHoraPromedioSalida(userId);

        // 4. Calcular tiempo promedio de estadía diario
        const tiempoPromedio = await obtenerTiempoEstadiaPromedio(userId);

        // 5. Consistencia en la asistencia
        const frecuenciaAsistencia = await obtenerFrecuenciaAsistencia(userId);
        const porcentajePuntualidad = calcularPorcentajePuntualidad(userId);

        // 6. Movimientos entre zonas
        const movimientos = await obtenerMovimientosEntreZonas(userId);
        const zonaEntradaFrecuente = calcularZonaFrecuente(movimientos, 'entrada');
        const zonaSalidaFrecuente = calcularZonaFrecuente(movimientos, 'salida');
        const rutasComunes = calcularRutasComunes(movimientos);
        const tiempoPromedioDesplazamiento = calcularTiempoPromedioDesplazamiento(movimientos);
        const porcentajeDesplazamientosZonasDistintas = calcularPorcentajeDesplazamientosZonasDistintas(movimientos);

        // 7. Compilación del reporte
        return {
            empleado: {
                nombre: `${user.firstName} ${user.lastName}`,
                dni: user.dni,
                email: user.email,
                empresa: user.empresa,
            },
            asistencia: {
                totalFichadas,
                asistenciaDiaria,
                asistenciaSemanal,
                asistenciaMensual,
                horaEntradaPromedio,
                horaSalidaPromedio,
                tiempoPromedio,
                frecuenciaAsistencia,
                porcentajePuntualidad,
            },
            movimientos: {
                zonaEntradaFrecuente,
                zonaSalidaFrecuente,
                rutasComunes,
                tiempoPromedioDesplazamiento,
                porcentajeDesplazamientosZonasDistintas
            }
        };
    } catch (error) {
        console.error('Error al generar el súper reporte del empleado:', error.message);
        throw new Error('No se pudo generar el súper reporte del empleado');
    }
};

// Funciones de apoyo (a definir en el mismo archivo o en otros servicios según convenga)

// Ejemplo de función para calcular el porcentaje de puntualidad
const calcularPorcentajePuntualidad = async (userId) => {
    const horarioEntradaEsperado = new Date();
    horarioEntradaEsperado.setHours(9, 0, 0, 0); // 9:00 AM, ajusta según tu horario laboral

    const asistencias = await Attendance.find({ userId, type: 'entrada' });
    const puntualidad = asistencias.filter(asistencia => asistencia.timestamp <= horarioEntradaEsperado).length;
    return ((puntualidad / asistencias.length) * 100).toFixed(2) + '%';
};

// Ejemplo de función para calcular la zona más frecuente
const calcularZonaFrecuente = (movimientos, tipo) => {
    const zonas = movimientos.map(mov => (tipo === 'entrada' ? mov.zonaEntrada : mov.zonaSalida));
    return zonas.reduce((acc, zona) => {
        acc[zona] = (acc[zona] || 0) + 1;
        return acc;
    }, {});
};

// Ejemplo de función para calcular rutas comunes entre zonas
const calcularRutasComunes = (movimientos) => {
    const rutas = movimientos.map(mov => `${mov.zonaEntrada} -> ${mov.zonaSalida}`);
    const frecuenciaRutas = rutas.reduce((acc, ruta) => {
        acc[ruta] = (acc[ruta] || 0) + 1;
        return acc;
    }, {});
    return frecuenciaRutas;
};

// Ejemplo de función para calcular el tiempo promedio de desplazamiento entre zonas
const calcularTiempoPromedioDesplazamiento = (movimientos) => {
    const totalTiempo = movimientos.reduce((acc, mov) => acc + mov.tiempoDesplazamiento, 0);
    return (totalTiempo / movimientos.length).toFixed(2) + ' minutos';
};

// Ejemplo de función para calcular el porcentaje de desplazamientos entre zonas distintas
const calcularPorcentajeDesplazamientosZonasDistintas = (movimientos) => {
    const distintos = movimientos.filter(mov => mov.zonaEntrada !== mov.zonaSalida).length;
    return ((distintos / movimientos.length) * 100).toFixed(2) + '%';
};


const calcularPromedioAsistenciaDiaria = async (userId) => {
    const totalFichadas = await Attendance.countDocuments({ userId });
    const diasActivos = await Attendance.distinct('timestamp', { userId })
        .then(timestamps => new Set(timestamps.map(ts => ts.toDateString())).size);
    return (totalFichadas / diasActivos).toFixed(2); // Promedio diario
};

const calcularPromedioAsistenciaSemanal = async (userId) => {
    const totalFichadas = await Attendance.countDocuments({ userId });
    const semanasActivas = await Attendance.distinct('timestamp', { userId })
        .then(timestamps => new Set(timestamps.map(ts => `${ts.getFullYear()}-${ts.getWeek()}`)).size);
    return (totalFichadas / semanasActivas).toFixed(2); // Promedio semanal
};

const calcularAsistenciaMensual = async (userId) => {
    const totalFichadas = await Attendance.countDocuments({ userId });
    const mesesActivos = await Attendance.distinct('timestamp', { userId })
        .then(timestamps => new Set(timestamps.map(ts => `${ts.getFullYear()}-${ts.getMonth()}`)).size);
    return (totalFichadas / mesesActivos).toFixed(2); // Promedio mensual
};

const obtenerHoraPromedioEntrada = async (userId) => {
    const entradas = await Attendance.find({ userId, type: 'entrada' });
    if (entradas.length === 0) return "N/A";

    const totalMinutos = entradas.reduce((acc, entrada) => {
        const date = entrada.timestamp;
        return acc + date.getHours() * 60 + date.getMinutes();
    }, 0);

    const promedioMinutos = totalMinutos / entradas.length;
    const horas = Math.floor(promedioMinutos / 60);
    const minutos = Math.round(promedioMinutos % 60);

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
};

const obtenerHoraPromedioSalida = async (userId) => {
    const salidas = await Attendance.find({ userId, type: 'salida' });
    if (salidas.length === 0) return "N/A";

    const totalMinutos = salidas.reduce((acc, salida) => {
        const date = salida.timestamp;
        return acc + date.getHours() * 60 + date.getMinutes();
    }, 0);

    const promedioMinutos = totalMinutos / salidas.length;
    const horas = Math.floor(promedioMinutos / 60);
    const minutos = Math.round(promedioMinutos % 60);

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
};

const obtenerFrecuenciaAsistencia = async (userId) => {
    const diasAsistidos = await Attendance.distinct('timestamp', { userId })
        .then(timestamps => new Set(timestamps.map(ts => ts.toDateString())).size);
    return diasAsistidos;
};

const obtenerMovimientosEntreZonas = async (userId) => {
    // Obtener todas las asistencias del usuario, ordenadas por fecha
    const asistencias = await Attendance.find({ userId }).sort({ timestamp: 1 });
    const movimientos = [];

    // Iterar sobre las asistencias para identificar entradas y salidas
    for (let i = 0; i < asistencias.length - 1; i++) {
        if (asistencias[i].type === 'entrada' && asistencias[i + 1].type === 'salida') {
            // Registrar movimiento entre la zona de entrada y la de salida
            const movimiento = {
                zonaEntrada: asistencias[i].zoneId,
                zonaSalida: asistencias[i + 1].zoneId,
                tiempoDesplazamiento: (asistencias[i + 1].timestamp - asistencias[i].timestamp) / 1000 / 60 // en minutos
            };
            movimientos.push(movimiento);
        }
    }

    return movimientos;
};

const obtenerMovimientosPorFecha = async (userId, fecha) => {

    const user = await userDetails(userId)



    // Establecer el rango de tiempo para el día especificado
    const inicioDia = new Date(fecha);
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date(fecha);
    finDia.setHours(23, 59, 59, 999);


    // Consultar las fichadas del usuario en el rango de tiempo especificado
    const movimientos = await Attendance.find({
        userId,
        timestamp: {
            $gte: inicioDia,
            $lt: finDia
        }
    }).sort({ timestamp: 1 }); // Ordenar cronológicamente

    console.log(movimientos)

    // Formatear el reporte
    const reporteMovimientos = movimientos.map(mov => ({
        tipo: mov.type, // 'entrada' o 'salida'
        zona: mov.zoneId,
        fechaHora: mov.timestamp
    }));

    return {
        user,
        fecha: inicioDia.toDateString(),
        movimientos: reporteMovimientos
    };
};

const obtenerTodosLosMovimientos = async (userId) => {

    const user = await userDetails(userId)
    // Consultar todas las fichadas del usuario ordenadas cronológicamente
    const movimientos = await Attendance.find({ userId }).sort({ timestamp: 1 });

    // Formatear el reporte
    const reporteMovimientos = movimientos.map(mov => ({
        tipo: mov.type, // 'entrada' o 'salida'
        zona: mov.zoneId,
        fechaHora: mov.timestamp
    }));

    return {
        user,
        movimientos: reporteMovimientos
    };
};



module.exports = {
    obtenerTotalFichadas,
    obtenerAsistenciaDiaria,
    obtenerAsistenciaSemanal,
    obtenerAsistenciaMensual,
    obtenerFichadasPorZona,
    obtenerHorarioPico,
    obtenerTiempoEstadiaPromedio,
    generarSuperReporteEmpleado,
    obtenerMovimientosPorFecha,
    obtenerTodosLosMovimientos
};
