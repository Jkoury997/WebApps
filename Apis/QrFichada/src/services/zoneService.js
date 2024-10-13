// /services/zoneService.js
const Zone = require('../database/models/Zone');

// Servicio para crear una nueva zona de fichada
const createZone = async (zoneData) => {
    const { nombre, empresaId } = zoneData;

    // Crear la nueva zona de fichada
    const newZone = new Zone({
        nombre,
        empresaId
    });

    await newZone.save();
    return newZone;
};

// Servicio para obtener todas las zonas de una empresa con manejo de errores
const getZonesByEmpresa = async (empresaId) => {
    const zones = await Zone.find({ empresaId });

    if (zones.length === 0) {
        throw new Error('No se encontraron zonas para esta empresa.');
    }

    return zones;
};

// Servicio para obtener todas las zonas de una empresa con manejo de errores
const getZonesById = async (zoneId) => {
    const zone = await Zone.findOne({ _id: zoneId });

    if (!zone) {
        throw new Error('Zona no encontrada');
    }

    return zone;
};

// Servicio para vincular una zona con un dispositivo de confianza (trustdevice)
const linkZoneWithTrustDevice = async (zoneId, trustdevice) => {
    const zone = await Zone.findOne({ _id: zoneId });
    if (!zone) {
        throw new Error('Zona no encontrada');
    }
    zone.trustdevice = trustdevice;
    await zone.save();
    return zone;
};

// Servicio para obtener una zona por trustdevice
const getZoneByTrustDevice = async (trustdevice) => {
    const zone = await Zone.findOne({ trustdevice });
    if (!zone) {
        throw new Error('Zona no encontrada con ese dispositivo de confianza');
    }
    return zone;
};

// Servicio para eliminar una zona por ID
const deleteZone = async (zoneId) => {
    const zone = await Zone.findByIdAndDelete(zoneId);
    if (!zone) {
        throw new Error('Zona no encontrada');
    }
    return zone;
};

module.exports = {
    createZone,
    getZonesByEmpresa,
    linkZoneWithTrustDevice,
    getZoneByTrustDevice,
    deleteZone,
    getZonesById
};
