// /controllers/zoneController.js
const zoneService = require('../services/zoneService');

// Controlador para crear una nueva zona de fichada
const createZone = async (req, res) => {
    try {
        const zoneData = req.body;
        const newZone = await zoneService.createZone(zoneData);
        res.status(201).json(newZone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener todas las zonas de una empresa
const getZonesByEmpresa = async (req, res) => {
    try {
        const { empresaId } = req.params;
        const zones = await zoneService.getZonesByEmpresa(empresaId);

        // Si no hay zonas, devolvemos un array vacío y un mensaje informativo
        if (zones.length === 0) {
            return res.status(200).json({ message: 'No se encontraron zonas para esta empresa.', zones: [] });
        }

        res.status(200).json(zones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Controlador para vincular una zona con un trustdevice
const linkZoneWithTrustDevice = async (req, res) => {
    try {
        const { zoneId, trustdevice } = req.body;
        const updatedZone = await zoneService.linkZoneWithTrustDevice(zoneId, trustdevice);
        res.status(200).json(updatedZone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener una zona por trustdevice
const getZoneByTrustDevice = async (req, res) => {
    try {
        const { trustdevice } = req.params;
        const zone = await zoneService.getZoneByTrustDevice(trustdevice);
        res.status(200).json(zone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para eliminar una zona
const deleteZone = async (req, res) => {
    try {
        const { id } = req.params;
        await zoneService.deleteZone(id);
        res.status(200).json({ message: 'Zona eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createZone,
    getZonesByEmpresa,
    linkZoneWithTrustDevice,
    getZoneByTrustDevice,
    deleteZone
};
