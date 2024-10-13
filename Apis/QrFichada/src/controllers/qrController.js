const qrService = require('../services/qrService');

// Generar un nuevo UUID
const generateUUID = async (req, res) => {
    try {
        const { userId } = req.body;  // Recibir el userId en el body de la solicitud
        const result = await qrService.generateUUID(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verificar si un UUID es válido
const verifyUUID = async (req, res) => {
    try {
        const { uuid } = req.params;
        const result = await qrService.verifyUUID(uuid);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    generateUUID,
    verifyUUID
};
