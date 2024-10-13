const QrCode = require('../database/models/QrCode');

// Servicio para generar y guardar un nuevo QR con UUID generado en el modelo
const generateUUID = async (userId) => {
    // Verificar si el userId existe

    const expirationTime = new Date(Date.now() + 20 * 1000); // Expira en 20 segundos

    // Crear el nuevo código QR en la base de datos con el UUID generado automáticamente
    const qrCode = new QrCode({
        userId,
        expiresAt: expirationTime
    });


    await qrCode.save();


    return { uuid: qrCode.uuid, expiresAt: qrCode.expiresAt };
};

// Servicio para verificar si el UUID es válido
const verifyUUID = async (uuid) => {
    const qrCode = await QrCode.findOne({ uuid });

    if (!qrCode) {
        throw new Error('UUID no encontrado');
    }

    if (qrCode.expiresAt < new Date()) {
        throw new Error('El UUID ha expirado');
    }

    return qrCode;
};

module.exports = {
    generateUUID,
    verifyUUID
};
