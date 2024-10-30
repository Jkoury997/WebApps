const trustDeviceService = require('../services/trustDeviceService');
const otpService = require('../services/recoveryService');
const userService = require('../services/userService');

// Registrar un dispositivo de confianza
const registerTrustedDevice = async (req, res) => {
    try {
        const { userId, fingerprint } = req.body;

        // Registrar el dispositivo como confiable
        const trustedDevice = await trustDeviceService.registerTrustedDevice(userId, fingerprint);
        res.status(200).json({ message: 'Dispositivo registrado como de confianza.', trustedDevice });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el dispositivo de confianza.', error: error.message });
    }
};

// Verificar si un dispositivo es de confianza
const verifyTrustedDevice = async (req, res) => {
    try {
        const { userId, fingerprint } = req.body;

        // Verificar si el dispositivo es de confianza
        const isTrusted = await trustDeviceService.isTrustedDevice(userId, fingerprint);
        if (isTrusted) {
            res.status(200).json({ message: 'El dispositivo es de confianza.',isTrusted:true });
        } else {
            res.status(403).json({ message: 'Dispositivo no reconocido.',isTrusted:false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar el dispositivo de confianza.', error: error.message });
    }
};

// Actualizar un dispositivo de confianza mediante OTP
const updateDeviceWithOTP = async (req, res) => {
    
        const { email,empresaId, fingerprint, otpCode } = req.body;

        // Verificar si el OTP es válido
        const {isValidOTP} = await otpService.verifyOTP(email, empresaId,otpCode);
        
        if (!isValidOTP) {
            return res.status(403).json({ message: 'OTP inválido o expirado.' });
        }

        const user = await userService.getUserByEmailAndEmpresa(email,empresaId)
        if (!user) {
            return res.status(403).json({ message: 'Email no encontrado.' });
        }


        // Intentar actualizar el dispositivo de confianza
        const updatedDevice = await trustDeviceService.updateTrustedDevice(user._id, fingerprint);
        try {
        if (!updatedDevice) {
            return res.status(404).json({ message: 'No se encontró un dispositivo de confianza para actualizar.' });
        }
        res.status(200).json({ message: 'Dispositivo de confianza actualizado con éxito.', updatedDevice });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el dispositivo de confianza.', error: error.message });
    }
};

module.exports = {
    registerTrustedDevice,
    verifyTrustedDevice,
    updateDeviceWithOTP
};
