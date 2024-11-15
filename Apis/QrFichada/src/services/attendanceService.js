// /services/attendanceService.js
const Attendance = require('../database/models/Attendance');
const { userDetails } = require('../utils/authUtils');
const { verifyUUID } = require('./qrService'); // Importar el servicio que verifica el UUID del QR
const { getZonesById } = require('./zoneService');

const {sendNotification} = require("../utils/socketHandler");

const MorganaApiService = require("./MorganaApiService")

// Servicio para crear un nuevo registro de asistencia (deducir entrada o salida)
const createAttendance = async (attendanceData,io) => {
    const { uuid, zoneId } = attendanceData;
    let message = ""

    // Verificar si el UUID es válido y obtener el userId del QR code
    const qrCode = await verifyUUID(uuid);
    const userId = qrCode.userId; // Obtener el userId del código QR

    const user = await userDetails(userId); // Obtener la empresa del usuario

    // Obtener los detalles de la zona para verificar la empresa
    const zone = await getZonesById(zoneId)

    const zoneEmpresaId = zone.empresaId; // Obtener la empresa de la zona

    // Verificar si el usuario pertenece a la misma empresa que la zona
    if (user.empresa._id !== zoneEmpresaId) {
        throw new Error('El usuario no puede registrar asistencia en una zona de otra empresa.');
    }

    // Buscar la última asistencia del usuario en la misma zona
    const lastAttendance = await Attendance.findOne({
        userId,
        zoneId
    }).sort({ timestamp: -1 });

    // Deducir si es entrada o salida
    let type;
    const now = new Date();
    if (!lastAttendance || lastAttendance.type === 'salida') {
        type = 'entrada'; // Si no hay registros o el último registro es una salida, entonces es una entrada
    } else if (lastAttendance.type === 'entrada') {
        // Verificar si han pasado al menos 5 minutos desde la última entrada
        const lastAttendanceTime = new Date(lastAttendance.timestamp);
        const timeDifference = (now - lastAttendanceTime) / 1000 / 60; // Convertir a minutos

        if (timeDifference < 5) {
            message = 'Debe esperar al menos 5 minutos antes de marcar una salida.'
            sendNotification(userId, {message,type:"error"} , io);
            throw new Error(message);
        }

        type = 'salida'; // Si han pasado más de 5 minutos, entonces es una salida
    }


    // Crear la nueva asistencia
    const newAttendance = new Attendance({
        userId,
        zoneId,
        type
    });

    message = `${type} registrada correctamente`;
    sendNotification(userId, { message,type:"success" }, io);

    await newAttendance.save();

    //Se crear la asistencia en la base de datos
    const Morgana = await MorganaApiService.sendAttendanceData(user)

    console.log(Morgana)
    return newAttendance;
};

// Servicio para obtener asistencias por usuario
const getAttendanceByUser = async (userId) => {
    const attendances = await Attendance.find({ userId }).populate('zoneId');
    if (!attendances) {
        throw new Error('No se encontraron asistencias para este usuario.');
    }
    return attendances;
};

// Servicio para obtener asistencias por zona
const getAttendanceByZone = async (zoneId) => {
    const attendances = await Attendance.find({ zoneId }).populate('zoneId');
    if (!attendances) {
        throw new Error('No se encontraron asistencias para esta zona.');
    }
    return attendances;
};

// Función para generar salidas automáticas
const generarSalidaAutomatica = async () => {
    try {
        const hace12Horas = new Date(Date.now() - 12 * 60 * 60 * 1000);

        // Buscar todas las entradas sin salida correspondiente y sin cierre automático
        const entradasSinSalida = await Attendance.find({
            type: 'entrada',
            timestamp: { $lte: hace12Horas },
            hasAutomaticClosure: { $ne: true } // Solo las entradas que no tienen cierre automático
        });

        console.log(`Se encontraron ${entradasSinSalida.length} entradas sin salida para cerrar automáticamente.`);

        for (const entrada of entradasSinSalida) {
            try {
                // Verificar si ya existe una salida reciente para esta entrada
                const salidaExistente = await Attendance.findOne({
                    userId: entrada.userId,
                    zoneId: entrada.zoneId,
                    type: 'salida',
                    timestamp: { $gte: entrada.timestamp }, // Después de la entrada
                });

                if (salidaExistente) {
                    console.log(`La entrada ${entrada._id} ya tiene una salida registrada.`);
                    continue; // Saltar a la siguiente entrada
                }

                // Crear una salida automática
                await Attendance.create({
                    userId: entrada.userId,
                    zoneId: entrada.zoneId,
                    type: 'salida',
                    timestamp: new Date(), // Hora actual como salida automática
                    automaticClosure: true, // Marca que es un cierre automático
                });

                // Marcar la entrada como cerrada automáticamente
                await Attendance.updateOne(
                    { _id: entrada._id },
                    { hasAutomaticClosure: true }
                );

                console.log(`Cierre automático realizado para userId: ${entrada.userId}, zoneId: ${entrada.zoneId}`);
            } catch (entryError) {
                console.error(
                    `Error al procesar la entrada userId: ${entrada.userId}, zoneId: ${entrada.zoneId}:`,
                    entryError.message
                );
            }
        }

        console.log("Proceso de cierre automático completado.");
    } catch (error) {
        console.error("Error general al realizar el cierre automático:", error.message);
    }
};





module.exports = {
    createAttendance,
    getAttendanceByUser,
    getAttendanceByZone,
    generarSalidaAutomatica
};
